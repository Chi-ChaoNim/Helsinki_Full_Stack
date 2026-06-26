import { useEffect, useState } from "react";

import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => {
      return setAnecdotes(data);
    });
  }, []);

  return {
    anecdotes,
  };
};
