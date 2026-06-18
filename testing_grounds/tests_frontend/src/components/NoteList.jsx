import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import noteService from "../services/notes";
// import loginService from "../services/login";

import "../index.css";
import Notification from "./Notification";
// import LoginForm from "./loginForm";
// import Toggleable from "./Toggleable";

const NoteList = ({ notes, errorMessage, setErrorMessage }) => {
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem("loggedNoteappUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      noteService.setToken(user.token);
    }
  }, [user]);

  // const handleLogin = async ({ username, password }) => {
  //   try {
  //     const user = await loginService.login({ username, password });

  //     window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
  //     noteService.setToken(user.token);
  //     setUser(user);
  //   } catch {
  //     setErrorMessage("wrong credentials");
  //     setTimeout(() => {
  //       setErrorMessage(null);
  //     }, 5000);
  //   }
  // };
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
  // const loginForm = () => (
  //   <Toggleable buttonLabel="login">
  //     <LoginForm userLogin={handleLogin} />
  //   </Toggleable>
  // );

  return (
    <div>
      <h1>Notes</h1>
      {errorMessage !== null ? <Notification message={errorMessage} /> : ""}
      {/* {!user && loginForm()} */}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}> Logout </button>
          <br></br>
        </div>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Content</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Important</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => {
              return (
                <TableRow key={note.id}>
                  <TableCell>
                    <Link to={`/notes/${note.id}`}>{note.content}</Link>
                  </TableCell>
                  <TableCell>{note.user?.name || "Guest"}</TableCell>
                  <TableCell>{note.important ? "yes" : ""}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default NoteList;
