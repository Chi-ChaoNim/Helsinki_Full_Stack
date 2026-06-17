import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import Notification from "./Notification";
import LoginForm from "./loginForm";
import Toggleable from "./Toggleable";
import noteService from "../services/notes";
import loginService from "../services/login";

const NoteList = ({ notes, errorMessage, setErrorMessage }) => {
  const [showAll, setShowAll] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem("loggedNoteappUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      noteService.setToken(user.token);
    }
  }, [user]);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

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

  return (
    <div>
      <h1>Notes</h1>
      {errorMessage !== null ? <Notification message={errorMessage} /> : ""}
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}> Logout </button>
          <br></br>
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
