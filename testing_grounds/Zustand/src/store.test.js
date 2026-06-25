import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useCounterStore, { useCounter, useCounterControls } from "./store";

beforeEach(() => {
  useCounterStore.setState({ counter: 0 });
});

describe("counter store", () => {
  it("initial state is 0", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current).toBe(0);
  });

  it("increament increases counter by 1", () => {
    const { result: counter } = renderHook(() => useCounter());
    const { result: controls } = renderHook(() => useCounterControls());

    act(() => {
      return controls.current.increment();
    });

    expect(counter.current).toBe(1);
  });

  it("decrease decreases counter by 1", () => {
    const { result: counter } = renderHook(() => useCounter());
    const { result: controls } = renderHook(() => useCounterControls());

    act(() => {
      return controls.current.decrease();
    });

    expect(counter.current).toBe(-1);
  });

  it("setZero resets counter to 0", () => {
    const { result: counter } = renderHook(() => useCounter());
    const { result: controls } = renderHook(() => useCounterControls());

    act(() => {
      controls.current.decrease();
      controls.current.decrease();
    });

    expect(counter.current).toBe(-2);

    act(() => controls.current.setZero());

    expect(counter.current).toBe(0);
  });
});
