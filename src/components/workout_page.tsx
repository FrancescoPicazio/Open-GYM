import { getAuth, signOut } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  Image,
} from "react-native";
import {
  DAY_KEYS,
  DayKey,
  fetchLatestScheduleWithCache,
  updateDay,
} from "../api/workout_repository";
import {
  getForegroundTimerState,
  startForegroundTimer,
  stopForegroundTimer,
  subscribeForegroundTimerEvents,
} from "../api/foreground_timer";
import { StopRequestReason, resolveStoppedTimerState } from "./circuit_timer_logic";
import { Circuito, Esercizio, GiornoAllenamento } from "../types/workout";
import { ExerciseCard, ExerciseDetail } from "./exercise_card";
import GymCard from "./gym_card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KeepAwake from "react-native-keep-awake";

const LOGIN_STORAGE_KEY = "gym_login_credentials";

export default function WorkoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [days, setDays] = useState<Record<string, GiornoAllenamento>>({});
  const [selectedDay, setSelectedDay] = useState<DayKey | null>(null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number | null>(null);
  const [isCircuitSessionActive, setIsCircuitSessionActive] = useState(false);
  const daysRef = useRef<Record<string, GiornoAllenamento>>({});
  const pendingDayWriteRef = useRef<Promise<void>>(Promise.resolve());

  React.useEffect(() => {
    daysRef.current = days;
  }, [days]);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchLatestScheduleWithCache();
      const schedule = result.schedule;

      if (result.fallbackToCache) {
        Alert.alert(
          "Connessione assente",
          "Non sono riuscito ad aggiornare la scheda dal server. Ti mostro l'ultima versione salvata in cache."
        );
      }

      if (!schedule) {
        setScheduleId(null);
        setDays({});
        daysRef.current = {};
        setSelectedDay(null);
        return;
      }

      setScheduleId(schedule.scheduleId);
      setDays(schedule.days);
      daysRef.current = schedule.days;
      const firstDay = DAY_KEYS.find((key) => schedule.days[key]);
      setSelectedDay(firstDay ?? DAY_KEYS[0]);
      setSelectedExerciseIndex(null);
    } catch (err) {
      console.error(err);
      setError("Errore nel caricamento della scheda.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const confirmExitCircuitSession = useCallback(() => {
    Alert.alert(
      "Interrompere workout?",
      "Se torni indietro il timer del circuito verrà fermato.",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Interrompi",
          style: "destructive",
          onPress: () => {
            stopForegroundTimer().catch(() => undefined);
            setIsCircuitSessionActive(false);
          },
        },
      ],
    );
  }, []);

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (selectedExerciseIndex !== null) {
        setSelectedExerciseIndex(null);
        return true;
      }

      if (isCircuitSessionActive) {
        confirmExitCircuitSession();
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [confirmExitCircuitSession, isCircuitSessionActive, selectedExerciseIndex]);

  const currentDay = selectedDay ? days[selectedDay] : null;
  const onSelectDay = (dayKey: DayKey) => {
    setSelectedDay(dayKey);
    setSelectedExerciseIndex(null);
    setIsCircuitSessionActive(false);
  };

  const updateExercise = (exerciseIndex: number, updated: Esercizio) => {
    if (!selectedDay) return;
    const dayKey = selectedDay;
    const currentScheduleId = scheduleId;
    const dayToUpdate = daysRef.current[dayKey];
    if (!dayToUpdate) return;

    const baseExercises = dayToUpdate.esercizi ?? [];
    if (exerciseIndex >= baseExercises.length) return;

    const updatedDay: GiornoAllenamento = {
      ...dayToUpdate,
      esercizi: baseExercises.map((exercise, index) =>
        index === exerciseIndex ? updated : exercise
      ),
    };

    const nextDays = { ...daysRef.current, [dayKey]: updatedDay };
    daysRef.current = nextDays;
    setDays(nextDays);

    if (!currentScheduleId) return;

    pendingDayWriteRef.current = pendingDayWriteRef.current
      .then(() => updateDay(currentScheduleId, dayKey, updatedDay))
      .catch((err) => {
        console.error(err);
        Alert.alert("Errore", "Impossibile aggiornare la scheda.");
      });
  };

  const toggleExerciseDone = (exerciseIndex: number) => {
    if (!selectedDay || !currentDay) return;

    const baseExercises = currentDay.esercizi ?? [];
    if (exerciseIndex >= baseExercises.length) return;

    const target = baseExercises[exerciseIndex];
    updateExercise(exerciseIndex, { ...target, done: !target.done });
  };

  const resetDayProgress = () => {
    if (!selectedDay) return;
    const dayKey = selectedDay;
    const currentScheduleId = scheduleId;
    const dayToUpdate = daysRef.current[dayKey];
    if (!dayToUpdate) return;

    const resetDay: GiornoAllenamento = {
      ...dayToUpdate,
      circuito: dayToUpdate.circuito
        ? {
            ...dayToUpdate.circuito,
            done: false,
          }
        : dayToUpdate.circuito,
      esercizi: (dayToUpdate.esercizi ?? []).map((exercise) => ({
        ...exercise,
        done: false,
        serie: (exercise.serie ?? []).map((serie) => ({
          ...serie,
          done: false,
        })),
      })),
    };

    const nextDays = { ...daysRef.current, [dayKey]: resetDay };
    daysRef.current = nextDays;
    setDays(nextDays);

    if (!currentScheduleId) return;

    pendingDayWriteRef.current = pendingDayWriteRef.current
      .then(() => updateDay(currentScheduleId, dayKey, resetDay))
      .catch((err) => {
        console.error(err);
        Alert.alert("Errore", "Impossibile resettare la scheda.");
      });
  };

  const startCircuitSession = () => {
    if (!currentDay?.circuito) return;
    setSelectedExerciseIndex(null);
    setIsCircuitSessionActive(true);
  };

  const completeCircuitSession = () => {
    if (!selectedDay) return;
    const dayKey = selectedDay;
    const currentScheduleId = scheduleId;
    const dayToUpdate = daysRef.current[dayKey];
    if (!dayToUpdate?.circuito) return;

    const updatedDay: GiornoAllenamento = {
      ...dayToUpdate,
      circuito: {
        ...dayToUpdate.circuito,
        done: true,
      },
    };

    const nextDays = { ...daysRef.current, [dayKey]: updatedDay };
    daysRef.current = nextDays;
    setDays(nextDays);
    setIsCircuitSessionActive(false);

    if (currentScheduleId) {
      pendingDayWriteRef.current = pendingDayWriteRef.current
        .then(() => updateDay(currentScheduleId, dayKey, updatedDay))
        .catch((err) => {
          console.error(err);
          Alert.alert("Errore", "Impossibile salvare il completamento del circuito.");
        });
    }

    Alert.alert("Esercizio completato", "Circuito completato con successo.");
  };

  const closeCircuitSession = () => {
    setIsCircuitSessionActive(false);
  };

  const onSignOut = async () => {
    Alert.alert("Logout", "Sei sicuro di voler uscire?", [
      {
        text: "Annulla",
        style: "cancel",
      },
      {
        text: "Esci",
        style: "destructive",
        onPress: () => {
          (async () => {
            try {
              await GoogleSignin.signOut();
            } catch {
            }

            await AsyncStorage.removeItem(LOGIN_STORAGE_KEY);

            await signOut(getAuth());
          })().catch(() => {
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
      enabled={Platform.OS === "ios"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Scheda Allenamento</Text>
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.linkText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <WorkoutContent
        loading={loading}
        error={error}
        currentDay={currentDay}
        days={days}
        selectedDay={selectedDay}
        selectedExerciseIndex={selectedExerciseIndex}
        onSelectDay={onSelectDay}
        onSelectExerciseIndex={setSelectedExerciseIndex}
        onReload={loadSchedule}
        onUpdateExercise={updateExercise}
        onToggleExerciseDone={toggleExerciseDone}
        onResetDayProgress={resetDayProgress}
        onStartCircuitSession={startCircuitSession}
        onCloseCircuitSession={closeCircuitSession}
        onCompleteCircuitSession={completeCircuitSession}
        isCircuitSessionActive={isCircuitSessionActive}
      />
    </KeyboardAvoidingView>
  );
}

type WorkoutContentProps = {
  loading: boolean;
  error: string | null;
  currentDay: GiornoAllenamento | null;
  days: Record<string, GiornoAllenamento>;
  selectedDay: DayKey | null;
  selectedExerciseIndex: number | null;
  onSelectDay: (dayKey: DayKey) => void;
  onSelectExerciseIndex: (index: number | null) => void;
  onReload: () => void;
  onUpdateExercise: (index: number, exercise: Esercizio) => void;
  onToggleExerciseDone: (index: number) => void;
  onResetDayProgress: () => void;
  onStartCircuitSession: () => void;
  onCloseCircuitSession: () => void;
  onCompleteCircuitSession: () => void;
  isCircuitSessionActive: boolean;
};

function WorkoutContent({
  loading,
  error,
  currentDay,
  days,
  selectedDay,
  selectedExerciseIndex,
  onSelectDay,
  onSelectExerciseIndex,
  onReload,
  onUpdateExercise,
  onToggleExerciseDone,
  onResetDayProgress,
  onStartCircuitSession,
  onCloseCircuitSession,
  onCompleteCircuitSession,
  isCircuitSessionActive,
}: Readonly<WorkoutContentProps>) {
  if (loading) {
    return <WorkoutStatus title="Caricamento..." />;
  }

  if (error) {
    return (
      <WorkoutStatus
        title={error}
        buttonLabel="Riprova"
        onPress={onReload}
      />
    );
  }

  if (!currentDay) {
    return (
      <WorkoutStatus
        title="Nessuna scheda disponibile."
        buttonLabel="Aggiorna"
        onPress={onReload}
      />
    );
  }

  return (
    <WorkoutDayView
      currentDay={currentDay}
      days={days}
      selectedDay={selectedDay}
      selectedExerciseIndex={selectedExerciseIndex}
      onSelectDay={onSelectDay}
      onSelectExerciseIndex={onSelectExerciseIndex}
      onUpdateExercise={onUpdateExercise}
      onToggleExerciseDone={onToggleExerciseDone}
      onResetDayProgress={onResetDayProgress}
      onStartCircuitSession={onStartCircuitSession}
      onCloseCircuitSession={onCloseCircuitSession}
      onCompleteCircuitSession={onCompleteCircuitSession}
      isCircuitSessionActive={isCircuitSessionActive}
    />
  );
}

type WorkoutStatusProps = {
  title: string;
  buttonLabel?: string;
  onPress?: () => void;
};

function WorkoutStatus({ title, buttonLabel, onPress }: Readonly<WorkoutStatusProps>) {
  return (
    <View style={styles.centered}>
      <Text style={styles.emptyText}>{title}</Text>
      {buttonLabel && onPress ? (
        <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
          <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

type WorkoutDayViewProps = {
  currentDay: GiornoAllenamento;
  days: Record<string, GiornoAllenamento>;
  selectedDay: DayKey | null;
  selectedExerciseIndex: number | null;
  onSelectDay: (dayKey: DayKey) => void;
  onSelectExerciseIndex: (index: number | null) => void;
  onUpdateExercise: (index: number, exercise: Esercizio) => void;
  onToggleExerciseDone: (index: number) => void;
  onResetDayProgress: () => void;
  onStartCircuitSession: () => void;
  onCloseCircuitSession: () => void;
  onCompleteCircuitSession: () => void;
  isCircuitSessionActive: boolean;
};

function WorkoutDayView({
  currentDay,
  days,
  selectedDay,
  selectedExerciseIndex,
  onSelectDay,
  onSelectExerciseIndex,
  onUpdateExercise,
  onToggleExerciseDone,
  onResetDayProgress,
  onStartCircuitSession,
  onCloseCircuitSession,
  onCompleteCircuitSession,
  isCircuitSessionActive,
}: Readonly<WorkoutDayViewProps>) {
  const dayLabel = useMemo(() => {
    if (!selectedDay) return "";
    return selectedDay.replace("day_", "Giorno ");
  }, [selectedDay]);

  const dayExercises = currentDay.esercizi ?? [];
  const selectedExercise =
    selectedExerciseIndex === null ? null : dayExercises[selectedExerciseIndex];

  if (isCircuitSessionActive && currentDay.circuito) {
    return (
      <CircuitSessionView
        dayLabel={dayLabel}
        circuito={currentDay.circuito}
        onBack={onCloseCircuitSession}
        onComplete={onCompleteCircuitSession}
      />
    );
  }

  if (selectedExercise) {
    return (
      <View style={styles.section}>
        <ExerciseDetail
          dayLabel={dayLabel}
          exercise={selectedExercise}
          onBack={() => onSelectExerciseIndex(null)}
          onChange={(updated) => onUpdateExercise(selectedExerciseIndex as number, updated)}
          onToggleDone={() => onToggleExerciseDone(selectedExerciseIndex as number)}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={dayExercises}
      keyExtractor={(item, index) => `${item.nome}-${index}`}
      contentContainerStyle={styles.scrollContent}
      ListHeaderComponent={
        <View style={styles.headerBlock}>
          <View style={styles.daysRow}>
            {DAY_KEYS.map((dayKey) => (
              <GymCard
                key={dayKey}
                title={dayKey.replace("day_", "Giorno ")}
                subtitle={`${days[dayKey]?.esercizi?.length ?? 0} esercizi`}
                selected={selectedDay === dayKey}
                onPress={() => onSelectDay(dayKey)}
              />
            ))}
          </View>
          <Text style={styles.sectionTitle}>{dayLabel}</Text>
        </View>
      }
      renderItem={({ item, index }) => (
        <ExerciseCard
          exercise={item}
          onPress={() => onSelectExerciseIndex(index)}
          onToggleDone={() => onToggleExerciseDone(index)}
        />
      )}
      ItemSeparatorComponent={ListSeparator}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Nessun esercizio per questo giorno.</Text>
      }
      ListFooterComponent={
        <View style={styles.footerBlock}>
          {currentDay.circuito ? (
            <View style={styles.circuitCard}>
              <Text style={styles.circuitTitle}>Circuito</Text>
              <Text style={styles.circuitMeta}>
                Round: {currentDay.circuito.round}
              </Text>
              {currentDay.circuito.durata_esercizio ? (
                <Text style={styles.circuitMeta}>
                  Durata: {currentDay.circuito.durata_esercizio} s
                </Text>
              ) : null}
              {currentDay.circuito.recupero ? (
                <Text style={styles.circuitMeta}>
                  Recupero: {currentDay.circuito.recupero} s
                </Text>
              ) : null}
              {currentDay.circuito.esercizi.map((exercise, index) => (
                <View key={`${exercise.nome}-${index}`} style={styles.circuitExercise}>
                  <Text style={styles.circuitExerciseName}>{exercise.nome}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.startCircuitButton} onPress={onStartCircuitSession}>
                <Text style={styles.startCircuitButtonText}>Avvia Circuito</Text>
              </TouchableOpacity>

              {currentDay.circuito.done ? (
                <Text style={styles.circuitDoneText}>Circuito completato ✓</Text>
              ) : null}
            </View>
          ) : null}

          <TouchableOpacity style={styles.resetDayButton} onPress={onResetDayProgress}>
            <Text style={styles.resetDayButtonText}>Reset scheda</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

function ListSeparator() {
  return <View style={styles.listSeparator} />;
}

function parseSeconds(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(String(value).replace(/[^\d]/g, ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

type CircuitPhase = "work" | "rest";

type CircuitSessionViewProps = {
  dayLabel: string;
  circuito: Circuito;
  onBack: () => void;
  onComplete: () => void;
};

function CircuitSessionView({ dayLabel, circuito, onBack, onComplete }: Readonly<CircuitSessionViewProps>) {
  const [currentRound, setCurrentRound] = useState(1);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [phase, setPhase] = useState<CircuitPhase>("work");
  const [remaining, setRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const mountedRef = useRef(true);
  const remainingRef = useRef(0);
  const stopRequestReasonRef = useRef<StopRequestReason>(null);

  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  const exercises = circuito.esercizi ?? [];
  const totalRounds = circuito.round > 0 ? circuito.round : 1;
  const workSeconds = parseSeconds(circuito.durata_esercizio, 30);
  const restSeconds = parseSeconds(circuito.recupero, 20);

  const setPhaseTimer = useCallback(async (nextPhase: CircuitPhase, pauseOnStart = false) => {
    const duration = nextPhase === "work" ? workSeconds : restSeconds;
    const validDuration = duration > 0 ? duration : 1;

    try {
      stopRequestReasonRef.current = "navigation";
      await stopForegroundTimer();
    } catch {
      stopRequestReasonRef.current = null;
    }

    setPhase(nextPhase);
    setRemaining(validDuration);
    setIsPaused(pauseOnStart);

    if (pauseOnStart) {
      return;
    }

    const label = nextPhase === "work" ? "Circuito • Esercizio" : "Circuito • Recupero";

    try {
      await startForegroundTimer(label, validDuration);
    } catch (error: any) {
      if (String(error?.code ?? "") === "TIMER_ALREADY_RUNNING") {
        Alert.alert(
          "Timer attivo",
          "C'è già un timer in esecuzione.",
          [
            { text: "Annulla", style: "cancel" },
            {
              text: "Cancella vecchio timer",
              style: "destructive",
              onPress: () => {
                startForegroundTimer(label, validDuration, true).catch(() => {
                  Alert.alert("Errore timer", "Impossibile avviare il nuovo timer.");
                });
              },
            },
          ],
        );
      } else {
        Alert.alert("Errore timer", "Impossibile avviare il timer.");
      }
    }
  }, [restSeconds, workSeconds]);

  useEffect(() => {
    mountedRef.current = true;
    if (exercises.length === 0) {
      onComplete();
      return;
    }

    setPhaseTimer("work");

    return () => {
      mountedRef.current = false;
    };
  }, [exercises.length, onComplete, setPhaseTimer]);

  const playDoubleBeep = useCallback(() => {
    Vibration.vibrate([0, 110, 80, 110]);
  }, []);

  const goToNextStep = useCallback(() => {
    if (phase === "work") {
      const isLastExerciseInRound = exerciseIndex >= exercises.length - 1;
      if (!isLastExerciseInRound) {
        setExerciseIndex((prev) => prev + 1);
        setPhaseTimer("work");
        return;
      }

      if (currentRound >= totalRounds) {
        onComplete();
        return;
      }

      setPhaseTimer("rest");
      return;
    }

    setCurrentRound((prev) => prev + 1);
    setExerciseIndex(0);
    setPhaseTimer("work", true);
  }, [currentRound, exerciseIndex, exercises.length, onComplete, phase, setPhaseTimer, totalRounds]);

  useEffect(() => {
    const subscription = subscribeForegroundTimerEvents(async (event) => {
      if (!mountedRef.current) return;

      if (event.status === "running") {
        if (typeof event.remainingSeconds === "number") {
          setRemaining(event.remainingSeconds);
        }
        setIsPaused(false);
        return;
      }

      if (event.status === "stopped") {
        const nextState = resolveStoppedTimerState(
          stopRequestReasonRef.current,
          remainingRef.current,
        );
        stopRequestReasonRef.current = null;
        setIsPaused(nextState.isPaused);
        setRemaining(nextState.remainingSeconds);
        return;
      }

      if (event.status === "finished") {
        setRemaining(0);
        setIsPaused(false);
        playDoubleBeep();
        goToNextStep();
      }
    });

    getForegroundTimerState()
      .then((state) => {
        if (!mountedRef.current) return;
        if (state.running) {
          setRemaining(state.remainingSeconds);
          setIsPaused(false);
        }
      })
      .catch(() => {
      });

    return () => {
      subscription.remove();
    };
  }, [goToNextStep, playDoubleBeep]);

  const currentExercise = exercises[exerciseIndex] ?? null;
  const nextExercise = exercises[exerciseIndex + 1] ?? null;
  const shouldKeepScreenAwake = !isPaused && remaining > 0;

  useEffect(() => {
    if (!shouldKeepScreenAwake) {
      KeepAwake.deactivate();
      return;
    }

    KeepAwake.activate();

    return () => {
      KeepAwake.deactivate();
    };
  }, [shouldKeepScreenAwake]);

  const pauseTimerByTap = async () => {
    if (remaining <= 0 || isPaused) return;

    try {
      stopRequestReasonRef.current = "pause";
      await stopForegroundTimer();
    } catch {
      stopRequestReasonRef.current = null;
    }

    setRemaining((prev) => (prev > 0 ? prev : 1));
    setIsPaused(true);
  };

  const resumeTimer = async () => {
    if (remaining <= 0 || !isPaused) return;

    const label = phase === "work" ? "Circuito • Esercizio" : "Circuito • Recupero";
    try {
      await startForegroundTimer(label, remaining);
      setIsPaused(false);
    } catch (error: any) {
      if (String(error?.code ?? "") === "TIMER_ALREADY_RUNNING") {
        Alert.alert(
          "Timer attivo",
          "C'è già un timer in esecuzione.",
          [
            { text: "Annulla", style: "cancel" },
            {
              text: "Cancella vecchio timer",
              style: "destructive",
              onPress: () => {
                startForegroundTimer(label, remaining, true)
                  .then(() => setIsPaused(false))
                  .catch(() => {
                    Alert.alert("Errore timer", "Impossibile avviare il nuovo timer.");
                  });
              },
            },
          ],
        );
      } else {
        Alert.alert("Errore timer", "Impossibile riprendere il timer.");
      }
    }
  };

  const goToPreviousExercise = () => {
    if (exercises.length === 0) return;
    if (exerciseIndex <= 0) return;

    setExerciseIndex((prev) => prev - 1);
    setPhaseTimer("work", true);
  };

  const goToNextExercise = () => {
    if (exercises.length === 0) return;
    if (exerciseIndex >= exercises.length - 1) return;

    setExerciseIndex((prev) => prev + 1);
    setPhaseTimer("work", true);
  };

  return (
    <View style={styles.circuitSessionContainer}>
      <View style={styles.circuitSessionHeader}>
        <TouchableOpacity
          onPress={async () => {
            try {
              stopRequestReasonRef.current = "navigation";
              await stopForegroundTimer();
            } catch {
              stopRequestReasonRef.current = null;
            }
            onBack();
          }}
        >
          <Text style={styles.linkText}>Indietro</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.circuitSessionTitle}>Circuito Del {dayLabel} <Text style={styles.circuitSessionRound}>Giro {currentRound}</Text>
</Text>

      <View style={styles.circuitSessionCard}>
        <Text style={styles.circuitSessionLabel}>
          {phase === "work" ? "Esercizio corrente" : "Recupero"}
        </Text>
        <Text style={styles.circuitSessionExerciseName}>
          {phase === "work" ? currentExercise?.nome ?? "-" : "Recupera"}
        </Text>
        {phase === "work" && currentExercise?.note ? (
          <Text style={styles.circuitSessionNote}>{currentExercise.note}</Text>
        ) : null}
        {currentExercise?.immagine ? <Image
          source={{ uri: currentExercise.immagine }}
          style={styles.exerciseImage}
          resizeMode="contain"
        /> : null}
      </View>

      <View style={styles.circuitSessionNextCard}>
        <Text style={styles.circuitSessionNextLabel}>Prossimo</Text>
        <Text style={styles.circuitSessionNextName}>
          {phase === "rest"
            ? exercises[0]?.nome ?? "-"
            : nextExercise?.nome ?? "Fine giro"}
        </Text>
                {nextExercise?.immagine ? <Image
          source={{ uri: nextExercise.immagine }}
          style={styles.exerciseImageNext}
          resizeMode="contain"
        /> : null}
      </View>

      <TouchableOpacity
        style={[
          styles.circuitTimer,
          phase === "rest" ? styles.circuitTimerRest : styles.circuitTimerWork,
        ]}
        onPress={pauseTimerByTap}
      >
        <Text style={styles.circuitTimerLabel}>{phase === "work" ? "Durata" : "Recupero"}</Text>
        <Text style={styles.circuitTimerValue}>{remaining}s</Text>
        <Text style={styles.circuitTimerHint}>{isPaused ? "In pausa" : "Tap per pausa"}</Text>
      </TouchableOpacity>

      {isPaused && remaining > 0 ? (
        <TouchableOpacity style={styles.resumeTimerButton} onPress={resumeTimer}>
          <Text style={styles.resumeTimerButtonText}>Riprendi timer</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.circuitNavRow}>
        <TouchableOpacity
          style={styles.circuitNavButton}
          onPress={goToPreviousExercise}
          disabled={exerciseIndex <= 0}
        >
          <Text style={styles.circuitNavButtonText}>{"<<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circuitNavButton}
          onPress={goToNextExercise}
          disabled={exerciseIndex >= exercises.length - 1}
        >
          <Text style={styles.circuitNavButtonText}>{">>"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0B0B0F",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  linkText: {
    color: "#8EC5FC",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  headerBlock: {
    gap: 14,
    marginBottom: 6,
  },
  daysRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  section: {
    gap: 14,
  },
  footerBlock: {
    gap: 14,
    marginTop: 12,
  },
  listSeparator: {
    height: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  circuitCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#151721",
    gap: 8,
  },
  circuitTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  circuitMeta: {
    color: "#B7B7C9",
  },
  circuitExercise: {
    paddingVertical: 4,
  },
  circuitExerciseName: {
    color: "#FFFFFF",
  },
  startCircuitButton: {
    marginTop: 12,
    backgroundColor: "#4C6FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  startCircuitButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  circuitDoneText: {
    color: "#6BFFB3",
    marginTop: 8,
    fontWeight: "600",
  },
  resetDayButton: {
    backgroundColor: "#2A2D3A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  resetDayButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#FFFFFF",
    marginBottom: 16,
  },
  errorText: {
    color: "#FF6B6B",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#4C6FFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  exerciseImage: {
    width: "100%",
    height: 150,
    borderRadius: 18,
    marginTop: 20,
    overflow: "hidden",
  },
  exerciseImageNext: {
    width: "100%",
    height: 75,
    borderRadius: 18,
    marginTop: 20,
    overflow: "hidden",
  },
  circuitSessionContainer: {
    flex: 1,
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  circuitSessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circuitSessionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",

  },
  circuitSessionRound: {
    color: "#B7B7C9",
    fontSize: 16,
    fontWeight: "600",
  },
  circuitSessionCard: {
    backgroundColor: "#151721",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  circuitSessionLabel: {
    color: "#8EC5FC",
    fontWeight: "700",
  },
  circuitSessionExerciseName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  circuitSessionNote: {
    color: "#B7B7C9",
    fontStyle: "italic",
  },
  circuitSessionNextCard: {
    backgroundColor: "#10131B",
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  circuitSessionNextLabel: {
    color: "#7B8397",
    fontSize: 12,
    fontWeight: "600",
  },
  circuitSessionNextName: {
    color: "#D8DEEC",
    fontSize: 14,
    fontWeight: "600",
  },
  circuitTimer: {
    marginTop: 8,
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    gap: 6,
  },
  circuitTimerWork: {
    backgroundColor: "#4C6FFF",
  },
  circuitTimerRest: {
    backgroundColor: "#2E8B57",
  },
  circuitTimerLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  circuitTimerValue: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },
  circuitTimerHint: {
    color: "#FFFFFF",
    opacity: 0.9,
    fontSize: 12,
    fontWeight: "600",
  },
  resumeTimerButton: {
    backgroundColor: "#4C6FFF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  resumeTimerButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  circuitNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  circuitNavButton: {
    flex: 1,
    backgroundColor: "#2A2D3A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  circuitNavButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});
