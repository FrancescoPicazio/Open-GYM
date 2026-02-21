import { NativeEventEmitter, NativeModules, Platform } from "react-native";

type TimerState = {
  running: boolean;
  remainingSeconds: number;
  label: string;
};

type TimerEventStatus = "running" | "finished" | "stopped" | "already_running";

export type ForegroundTimerEvent = {
  status: TimerEventStatus;
  remainingSeconds?: number;
  label?: string;
};

const { ForegroundTimer } = NativeModules;

const defaultState: TimerState = {
  running: false,
  remainingSeconds: 0,
  label: "Timer",
};

function isAvailable() {
  return Platform.OS === "android" && Boolean(ForegroundTimer);
}

export async function getForegroundTimerState(): Promise<TimerState> {
  if (!isAvailable()) return defaultState;
  return ForegroundTimer.getState();
}

export async function startForegroundTimer(
  label: string,
  seconds: number,
  forceReplace = false,
): Promise<TimerState> {
  if (!isAvailable()) {
    throw new Error("Foreground timer disponibile solo su Android");
  }
  return ForegroundTimer.startTimer({ label, seconds, forceReplace });
}

export async function stopForegroundTimer(): Promise<TimerState> {
  if (!isAvailable()) return defaultState;
  return ForegroundTimer.stopTimer();
}

export function subscribeForegroundTimerEvents(handler: (event: ForegroundTimerEvent) => void) {
  if (!isAvailable()) {
    return { remove: () => {} };
  }

  const emitter = new NativeEventEmitter(ForegroundTimer);
  const subscription = emitter.addListener("foregroundTimerEvent", handler);
  return {
    remove: () => subscription.remove(),
  };
}
