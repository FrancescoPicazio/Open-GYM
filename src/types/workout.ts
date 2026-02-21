export type Serie = {
  ripetizioni: number | string | null;
  carico: number | null;
  recupero?: number | string | null;
  done?: boolean;
};

export type Esercizio = {
  nome: string;
  serie: Serie[];
  immagine?: string | null;
  note?: string;
  done?: boolean;
};

export type Circuito = {
  round: number;
  durata_esercizio?: string | null;
  recupero?: string | null;
  esercizi: Esercizio[];
  done?: boolean;
};

export type GiornoAllenamento = {
  giorno: number;
  esercizi: Esercizio[];
  circuito?: Circuito | null;
};

export type SchedaAllenamento = {
  scheduleId: string;
  days: Record<string, GiornoAllenamento>;
};
