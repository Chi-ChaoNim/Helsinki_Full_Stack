import { useState } from "react";
import { Button } from "@mui/material";

const LoginForm = ({ userLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    userLogin({
      username,
      password,
    });

    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <Button variant="contained">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
