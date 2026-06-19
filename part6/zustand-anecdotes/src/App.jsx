import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import FilterBar from "./components/FilterBar";

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <FilterBar />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
