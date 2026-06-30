import { useState } from "react";
import { Button, TextField } from "@mui/material";

const Login = ({ user, handleLogin, handleLogout }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section>
      <h1>Login to application</h1>
      {user ? (
        <div>
          <p>{user.name} logged in</p>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleLogin({ username, password });
            }}
          >
            <div>
              <TextField
                label="Username"
                variant="standard"
                size="small"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <TextField
                label="Password"
                type="password"
                variant="standard"
                size="small"
                margin="normal"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <Button type="submit" variant="contained">
              Login
            </Button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Login;
