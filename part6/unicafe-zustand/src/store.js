import { create } from "zustand";

const useStatsStore = create((set) => ({
  counters: { good: 0, neutral: 0, bad: 0 },
  actions: {
    increaseGood: () =>
      set((state) => ({
        counters: { ...state.counters, good: state.counters.good + 1 },
      })),
    increaseNeutral: () =>
      set((state) => ({
        counters: { ...state.counters, neutral: state.counters.neutral + 1 },
      })),
    increaseBad: () =>
      set((state) => ({
        counters: { ...state.counters, bad: state.counters.bad + 1 },
      })),
  },
}));

export const useStatsCounters = () => useStatsStore((state) => state.counters);
export const useStatsActions = () => useStatsStore((state) => state.actions);
