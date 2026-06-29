import { useEffect, useState } from "react";

import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => {
      return setAnecdotes(data);
    });
  }, []);

  const addAnecdote = (content) => {
    anecdoteService.createNew(content).then((returning) => {
      setAnecdotes([...anecdotes, returning]);
    });
  };

  const deleteAnecdote = (id) => {
    anecdoteService.remove(id).then(() => {
      setAnecdotes(anecdotes.filter((a) => a.id !== id));
    });
  };

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  };
};
