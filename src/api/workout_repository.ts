import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import { GiornoAllenamento, SchedaAllenamento } from "../types/workout";

const DAY_KEYS = ["day_1", "day_2", "day_3"] as const;
const DAY_KEY_ALIASES: Record<(typeof DAY_KEYS)[number], string[]> = {
  day_1: ["day_1", "day1", "day-1", "giorno_1", "giorno1", "giorno-1"],
  day_2: ["day_2", "day2", "day-2", "giorno_2", "giorno2", "giorno-2"],
  day_3: ["day_3", "day3", "day-3", "giorno_3", "giorno3", "giorno-3"],
};
const SUBCOLLECTION_DOC_ID = "current";
const SCHEDULE_CACHE_KEY = "gym_latest_schedule_cache";
const SCHEDULE_CACHE_TTL_MS = 60 * 60 * 1000;

type DayKey = (typeof DAY_KEYS)[number];
type ScheduleCachePayload = {
  cachedAt: number;
  schedule: SchedaAllenamento | null;
};

type FetchLatestScheduleWithCacheResult = {
  schedule: SchedaAllenamento | null;
  fromCache: boolean;
  fallbackToCache: boolean;
};

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) {
    return null as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item)) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (item === undefined) continue;
      result[key] = sanitizeForFirestore(item);
    }

    return result as T;
  }

  return value;
}

async function withFirestoreTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Firestore timeout after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

function normalizeSerie(
  serieValue: unknown,
  legacyRecovery: unknown
): GiornoAllenamento["esercizi"][number]["serie"][number] {
  const serieData = isRecord(serieValue) ? serieValue : {};

  const ripetizioni =
    (serieData.ripetizioni as GiornoAllenamento["esercizi"][number]["serie"][number]["ripetizioni"]) ??
    null;

  const caricoRaw = serieData.carico;
  const carico = typeof caricoRaw === "number" ? caricoRaw : null;

  const recupero =
    (serieData.recupero as GiornoAllenamento["esercizi"][number]["serie"][number]["recupero"]) ??
    (legacyRecovery as GiornoAllenamento["esercizi"][number]["serie"][number]["recupero"]) ??
    null;

  const done =
    (serieData.done as GiornoAllenamento["esercizi"][number]["serie"][number]["done"]) ??
    false;

  return {
    ripetizioni,
    carico,
    recupero,
    done,
  };
}

function normalizeExercise(exerciseValue: unknown): GiornoAllenamento["esercizi"][number] | null {
  if (!isRecord(exerciseValue)) return null;

  const legacyRecovery = exerciseValue.recupero;
  const serieRaw = Array.isArray(exerciseValue.serie) ? exerciseValue.serie : [];
  const serie = serieRaw.map((item) => normalizeSerie(item, legacyRecovery));
  const inferredDone = serie.length > 0 && serie.every((item) => item.done === true);

  return {
    nome: typeof exerciseValue.nome === "string" ? exerciseValue.nome : "",
    serie,
    immagine: typeof exerciseValue.immagine === "string" ? exerciseValue.immagine : null,
    note: typeof exerciseValue.note === "string" ? exerciseValue.note : undefined,
    done: typeof exerciseValue.done === "boolean" ? exerciseValue.done : inferredDone,
  };
}

function normalizeSchedule(schedule: SchedaAllenamento): SchedaAllenamento {
  const normalizedDays: Record<string, GiornoAllenamento> = {};

  for (const dayKey of DAY_KEYS) {
    const day = schedule.days[dayKey];
    if (!day) continue;

    normalizedDays[dayKey] = {
      ...day,
      esercizi: (day.esercizi ?? [])
        .map((exercise) => normalizeExercise(exercise))
        .filter((exercise): exercise is GiornoAllenamento["esercizi"][number] => !!exercise),
    };
  }

  return {
    ...schedule,
    days: normalizedDays,
  };
}

async function readScheduleCache(): Promise<ScheduleCachePayload | null> {
  try {
    const raw = await AsyncStorage.getItem(SCHEDULE_CACHE_KEY);
    if (!raw) return null;

    const parsed = safeParseJson(raw);
    if (!isRecord(parsed)) return null;

    const cachedAt =
      typeof parsed.cachedAt === "number" ? parsed.cachedAt : Number(parsed.cachedAt);
    if (!Number.isFinite(cachedAt) || cachedAt <= 0) return null;

    const scheduleValue = parsed.schedule;
    if (scheduleValue !== null && !isRecord(scheduleValue)) return null;

    return {
      cachedAt,
      schedule: scheduleValue ? normalizeSchedule(scheduleValue as SchedaAllenamento) : null,
    };
  } catch (error) {
    console.warn("readScheduleCache failed:", error);
    return null;
  }
}

async function writeScheduleCache(schedule: SchedaAllenamento | null): Promise<void> {
  const payload: ScheduleCachePayload = {
    cachedAt: Date.now(),
    schedule,
  };
  await AsyncStorage.setItem(SCHEDULE_CACHE_KEY, JSON.stringify(payload));
}

async function updateScheduleCacheDay(
  scheduleId: string,
  dayKey: DayKey,
  dayData: GiornoAllenamento
): Promise<void> {
  const cached = await readScheduleCache();
  if (!cached?.schedule) return;
  if (cached.schedule.scheduleId !== scheduleId) return;

  const updatedSchedule: SchedaAllenamento = {
    ...cached.schedule,
    days: {
      ...cached.schedule.days,
      [dayKey]: dayData,
    },
  };

  await writeScheduleCache(updatedSchedule);
}

function normalizeDay(dayKey: DayKey, r?: unknown): GiornoAllenamento | null {
  const raw = typeof r === "string" ? safeParseJson(r) : r;
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const eserciziRaw =
    (data.esercizi as unknown[]) ??
    (data.exercises as unknown[]) ??
    [];
  const esercizi = Array.isArray(eserciziRaw)
    ? eserciziRaw
        .map((exercise) => normalizeExercise(exercise))
        .filter((exercise): exercise is GiornoAllenamento["esercizi"][number] => !!exercise)
    : [];

  const circuito = (data.circuito as GiornoAllenamento["circuito"]) ?? null;
  const dayNumber = Number(dayKey.replace(/\D/g, ""));
  const giorno = (data.giorno as number | undefined) ?? (dayNumber || 0);

  return {
    giorno,
    esercizi,
    circuito,
  };
}

function findDayFromDocument(
  docData: Record<string, unknown> | undefined,
  dayKey: DayKey
): GiornoAllenamento | null {
  if (!docData) return null;
  for (const alias of DAY_KEY_ALIASES[dayKey]) {
    const dayCandidate = normalizeDay(dayKey, docData[alias]);
    if (dayCandidate) return dayCandidate;
  }

  const giorni = [docData.day_1, docData.day_2, docData.day_3] as unknown[] | undefined;

  if (Array.isArray(giorni)) {
    const targetNumber = Number(dayKey.replace(/\D/g, ""));
    const match = giorni.find((i) => {
      const item = typeof i === "string" ? safeParseJson(i) : i;
      if (!item || typeof item !== "object") return false;
      const giorno = giorni.indexOf(i) + 1;
      return giorno === targetNumber;
    });
    const normalized = normalizeDay(dayKey, match);
    if (normalized) return normalized;
  }

  return null;
}

async function fetchLatestScheduleId(): Promise<string | null> {
  const schedeRef = firestore().collection("schede");

  try {
    // verifico che sono loggato
    const snapshot = await withFirestoreTimeout(
      schedeRef
        .orderBy(firestore.FieldPath.documentId(), "desc")
        .limit(1)
        .get(),
      10000
    );


    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }


    const fallbackSnapshot = await withFirestoreTimeout(
      schedeRef.limit(1).get(),
      10000
    );

    if (fallbackSnapshot.empty) return null;
    return fallbackSnapshot.docs[0].id;
  } catch (error) {
    console.error("fetchLatestScheduleId failed:", error);
    throw error;
  }
}

async function fetchDayFromParent(
  scheduleId: string,
  dayKey: DayKey
): Promise<GiornoAllenamento | null> {
  const docRef = firestore().collection("schede").doc(scheduleId);
  const snapshot = await withFirestoreTimeout(docRef.get(), 10000);
  const data = snapshot.data();
  return findDayFromDocument(data, dayKey);
}

async function fetchDayFromSubcollection(
  scheduleId: string,
  dayKey: DayKey
): Promise<GiornoAllenamento | null> {
  const docRef = firestore().collection("schede").doc(scheduleId);
  for (const alias of DAY_KEY_ALIASES[dayKey]) {
    const dayRef = docRef.collection(alias);
    const canonicalDayDoc = await withFirestoreTimeout(
      dayRef.doc(SUBCOLLECTION_DOC_ID).get(),
      10000
    );
    if (canonicalDayDoc.exists()) {
      return normalizeDay(dayKey, canonicalDayDoc.data());
    }

    const snapshot = await withFirestoreTimeout(dayRef.limit(1).get(), 10000);
    if (!snapshot.empty) {
      return normalizeDay(dayKey, snapshot.docs[0].data());
    }
  }

  return null;
}

async function fetchLatestScheduleFromNetwork(): Promise<SchedaAllenamento | null> {
  const scheduleId = await fetchLatestScheduleId();
  if (!scheduleId) return null;
  const days: Record<string, GiornoAllenamento> = {};

  for (const dayKey of DAY_KEYS) {
    const fromParent = await fetchDayFromParent(scheduleId, dayKey);
    if (fromParent) {
      days[dayKey] = fromParent;
      continue;
    }

    const fromSubcollection = await fetchDayFromSubcollection(
      scheduleId,
      dayKey
    );
    if (fromSubcollection) {
      days[dayKey] = fromSubcollection;
    }
  }

  return { scheduleId, days };
}

export async function fetchLatestScheduleWithCache(): Promise<FetchLatestScheduleWithCacheResult> {
  const cached = await readScheduleCache();
  const cacheIsFresh =
    !!cached && Date.now() - cached.cachedAt < SCHEDULE_CACHE_TTL_MS;

  if (cacheIsFresh) {
    return {
      schedule: cached.schedule,
      fromCache: true,
      fallbackToCache: false,
    };
  }

  try {
    const schedule = await fetchLatestScheduleFromNetwork();
    await writeScheduleCache(schedule);
    return {
      schedule,
      fromCache: false,
      fallbackToCache: false,
    };
  } catch (error) {
    if (cached?.schedule) {
      console.warn("Network fetch failed, using cached schedule:", error);
      return {
        schedule: cached.schedule,
        fromCache: true,
        fallbackToCache: true,
      };
    }

    throw error;
  }
}

export async function fetchLatestSchedule(): Promise<SchedaAllenamento | null> {
  const result = await fetchLatestScheduleWithCache();
  return result.schedule;
}

export async function updateDay(
  scheduleId: string,
  dayKey: DayKey,
  dayData: GiornoAllenamento
): Promise<void> {
  const db = firestore();

  const docRef = db.collection("schede").doc(scheduleId);
  const sanitizedDayData = sanitizeForFirestore(dayData);
  await withFirestoreTimeout(docRef.set({ [dayKey]: sanitizedDayData }, { merge: true }), 10000).catch((error) => {
    console.error("[updateDay] failed to write day to parent document:", error);
    throw error;
  });
  await updateScheduleCacheDay(scheduleId, dayKey, sanitizedDayData);
}

export { DAY_KEYS };
export type { DayKey, FetchLatestScheduleWithCacheResult };
