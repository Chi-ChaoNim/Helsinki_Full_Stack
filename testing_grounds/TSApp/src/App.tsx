import { useEffect, useState } from "react";

import type { Note } from "../types.ts";
import noteService from "./services/noteService";

const App = () => {
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    noteService.getAll().then((initalNotes) => {
      setNotes(initalNotes);
    });
  }, []);

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    noteService.create({ content: newNote }).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
    });
    setNewNote("");
  };

  return (
    <div>
      <form onSubmit={noteCreation}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
    </div>
  );
};
export default App;
