import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";

import noteService from "./services/notes";

import NoteList from "./components/NoteList";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Note from "./components/note";
import NoteForm from "./components/NoteForm";
import Notification from "./components/Notification";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initalNotes) => {
      setNotes(initalNotes);
    });
  }, []);

  const match = useMatch("/notes/:id");
  const note = match ? notes.find((note) => note.id === match.params.id) : null;

  const addNote = (noteObject) => {
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
      setNotification({
        text: `Note "${returnedNote.content}" added!`,
        type: "success",
      });
    });
  };
  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter((n) => n.id !== id));
    });
  };
  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch(() => {
        setErrorMessage(
          `Note "${note.content}" was already removed from the server`,
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3" } };

  return (
    <Container>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/" sx={style}>
              Home
            </Button>
            <Button color="inherit" component={Link} to="/notes" sx={style}>
              Notes
            </Button>
            <Button color="inherit" component={Link} to="/create" sx={style}>
              New Note
            </Button>
          </Toolbar>
        </AppBar>

        <Notification notification={notification} />

        <Routes>
          <Route
            path="/notes/:id"
            element={
              <Note
                note={note}
                toggleImportanceOf={toggleImportanceOf}
                deleteNote={deleteNote}
              />
            }
          />
          <Route
            path="/notes"
            element={
              <NoteList
                notes={notes}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
            }
          />
          <Route path="/create" element={<NoteForm createNote={addNote} />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Container>
  );
};

export default App;
