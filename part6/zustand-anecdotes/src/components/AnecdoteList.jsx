import { useAnecdotes, useAnecdoteActions } from "../anecdoteStore";
import { useNotificationActions } from "../notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, deleteA } = useAnecdoteActions();
  const { setMessage } = useNotificationActions();

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => {
                vote(anecdote.id);
                setMessage(`You voted for "${anecdote.content}"`);
              }}
            >
              vote
            </button>
            {anecdote.votes === 0 ? (
              <button onClick={() => deleteA(anecdote.id)}>delete</button>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
