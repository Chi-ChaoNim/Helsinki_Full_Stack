import { useAnecdotes } from "../hooks/useAnecdotes";

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes();
  const handleDelete = (anecdote) => {
    deleteAnecdote(anecdote.id);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <div key={anecdote.id}>
            <li>{anecdote.content}</li>
            <button
              onClick={() => {
                handleDelete(anecdote);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default AnecdoteList;
