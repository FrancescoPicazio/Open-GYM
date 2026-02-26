import { resolveStoppedTimerState } from "../src/components/circuit_timer_logic";

describe("resolveStoppedTimerState", () => {
  it("keeps remaining time when stop reason is pause", () => {
    const state = resolveStoppedTimerState("pause", 25);

    expect(state).toEqual({
      isPaused: true,
      remainingSeconds: 25,
    });
  });

  it("keeps remaining time when stop reason is navigation", () => {
    const state = resolveStoppedTimerState("navigation", 40);

    expect(state).toEqual({
      isPaused: true,
      remainingSeconds: 40,
    });
  });

  it("falls back to 1 second on pause/navigation when remaining is not positive", () => {
    const pauseState = resolveStoppedTimerState("pause", 0);
    const navigationState = resolveStoppedTimerState("navigation", -3);

    expect(pauseState.remainingSeconds).toBe(1);
    expect(navigationState.remainingSeconds).toBe(1);
  });

  it("sets remaining to zero when timer stops without explicit reason", () => {
    const state = resolveStoppedTimerState(null, 17);

    expect(state).toEqual({
      isPaused: true,
      remainingSeconds: 0,
    });
  });
});
