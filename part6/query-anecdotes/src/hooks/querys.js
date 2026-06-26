import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, createNew, updatedAnecdote } from "../services/anecdotes";
import { useContext } from "react";
import NotificationContext from "../NotificationContext";

export const useAnecdotes = () => {
  const { setMessage } = useNotification();

  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAll,
    retry: 1,
  });

  const addAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
    onError: (response) => {
      setMessage(`${response}`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    },
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: updatedAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((a) =>
          a.id === updatedAnecdote.id ? updatedAnecdote : a,
        ),
      );
    },
  });

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    handleVote: (anecdote) => {
      updateAnecdoteMutation.mutate({
        ...anecdote,
        votes: anecdote.votes + 1,
      });
      setMessage(`Anecdote "${anecdote.content}" voted`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    },
    onCreate: (event) => {
      event.preventDefault();
      const content = event.target.anecdote.value;
      event.target.reset();
      addAnecdoteMutation.mutate({ content, votes: 0 });
    },
  };
};

export const useNotification = () => useContext(NotificationContext);
