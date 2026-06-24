import anecdoteService from "../services/anecdotes";
import { useAnecdoteActions } from "../anecdoteStore";

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions();
  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    const newAnecdote = await anecdoteService.createNew(content);
    create(newAnecdote);
    e.target.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
