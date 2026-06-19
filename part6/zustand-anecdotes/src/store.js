import { create } from "zustand";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const useAnecdoteStore = create((set) => {
  return {
    anecdotes: anecdotesAtStart.map(asObject),
    filter: "",
    actions: {
      create: (anecdote) =>
        set((state) => ({
          anecdotes: state.anecdotes.concat(asObject(anecdote)),
        })),
      vote: (id) =>
        set((state) => ({
          anecdotes: state.anecdotes
            .map((a) => (a.id === id ? { ...a, votes: a.votes + 1 } : a))
            .toSorted((a, b) => b.votes - a.votes),
        })),
      setFilter: (value) => set(() => ({ filter: value })),
    },
  };
});

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter) || "";
  const needle = filter.toLowerCase();
  return anecdotes.filter((a) => a.content.toLowerCase().includes(needle));
};
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
