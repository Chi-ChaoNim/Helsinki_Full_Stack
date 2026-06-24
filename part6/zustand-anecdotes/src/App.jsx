import { useEffect } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import FilterBar from "./components/FilterBar";
import { useAnecdoteActions } from "./anecdoteStore";
import anecdoteService from "./services/anecdotes";
import Notification from "./components/Notification";

const App = () => {
  const { initialize } = useAnecdoteActions();

  useEffect(() => {
    anecdoteService.getAll().then((anecdotes) => initialize(anecdotes));
  }, [initialize]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <FilterBar />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
