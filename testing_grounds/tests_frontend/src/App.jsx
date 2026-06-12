import { useState, useEffect, useRef } from "react";
import "./index.css";
import Footer from "./components/Footer";
import Note from "./components/note";
import Notification from "./components/Notification";
import LoginForm from "./components/loginForm";
import NoteForm from "./components/NoteForm";
import Toggleable from "./components/Toggleable";
import noteService from "./services/notes";
import loginService from "./services/login";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initalNotes) => {
      setNotes(initalNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
    });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

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

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async () => {
    try {
      window.localStorage.clear();
      noteService.setToken(null);
      setUser(null);
    } catch {
      setErrorMessage("Not logged in");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <Toggleable buttonLabel="login">
      <LoginForm userLogin={handleLogin} />
    </Toggleable>
  );

  const noteFormRef = useRef();

  const noteForm = () => (
    <Toggleable buttonLabel="New note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Toggleable>
  );

  return (
    <div>
      <h1>Notes</h1>
      {errorMessage !== null ? <Notification message={errorMessage} /> : ""}
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.username} logged in</p>
          <button onClick={handleLogout}> Logout </button>
          <br></br>
          {noteForm()}
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
