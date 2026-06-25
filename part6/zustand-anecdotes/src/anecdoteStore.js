import { create } from "zustand";
import anecdoteService from "./services/anecdotes";

export const useAnecdoteStore = create((set) => {
  return {
    anecdotes: [],
    filter: "",
    actions: {
      initialize: async () => {
        const anecdotes = await anecdoteService.getAll();
        set(() => ({ anecdotes }));
      },

      create: (anecdote) =>
        set((state) => ({
          anecdotes: state.anecdotes.concat(anecdote),
        })),

      vote: async (id) => {
        const anecdote = useAnecdoteStore
          .getState()
          .anecdotes.find((a) => a.id === id);

        const updated = await anecdoteService.update(id, {
          ...anecdote,
          votes: anecdote.votes + 1,
        });

        set((state) => ({
          anecdotes: state.anecdotes
            .map((a) => (a.id === id ? updated : a))
            .toSorted((a, b) => b.votes - a.votes),
        }));
      },

      deleteA: async (id) => {
        await anecdoteService.deleteAnecdote(id);

        set((state) => ({
          anecdotes: state.anecdotes.filter((a) => a.id !== id),
        }));
      },

      setFilter: (value) => set(() => ({ filter: value })),
    },
  };
});

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter) || "";
  const needle = filter.toLowerCase();
  return anecdotes
    .filter((a) => a.content.toLowerCase().includes(needle))
    .toSorted((a, b) => b.votes - a.votes);
};
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
