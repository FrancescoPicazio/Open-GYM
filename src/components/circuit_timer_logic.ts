export type StopRequestReason = "pause" | "navigation" | null;

type StoppedTimerState = {
  isPaused: boolean;
  remainingSeconds: number;
};

export function resolveStoppedTimerState(
  reason: StopRequestReason,
  currentRemainingSeconds: number,
): StoppedTimerState {
  const safeRemaining = currentRemainingSeconds > 0 ? currentRemainingSeconds : 1;

  if (reason === "pause" || reason === "navigation") {
    return {
      isPaused: true,
      remainingSeconds: safeRemaining,
    };
  }

  return {
    isPaused: true,
    remainingSeconds: 0,
  };
}
