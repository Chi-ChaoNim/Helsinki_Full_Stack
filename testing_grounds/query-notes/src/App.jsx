import { useNotes } from "./hooks/useNotes";

const App = () => {
  const { notes, isPending, isError, addNote, toggleImportance } = useNotes();

  if (isPending) {
    return <div>loading data...</div>;
  }

  if (isError) {
    return <div>Error loading data...</div>;
  }

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map((note) => (
        <li key={note.id}>
          {note.important ? <strong>{note.content}</strong> : note.content}
          <button onClick={() => toggleImportance(note)}>
            {note.important ? "make not important" : "make important"}
          </button>
        </li>
      ))}
    </div>
  );
};

export default App;
