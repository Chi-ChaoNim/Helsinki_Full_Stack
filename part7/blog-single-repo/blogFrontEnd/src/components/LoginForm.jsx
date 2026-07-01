import { Button } from "@mui/material";
import useField from "../hooks/useField";

const LoginForm = ({ userLogin }) => {
  const username = useField("text");
  const password = useField("text");

  const handleLogin = (event) => {
    event.preventDefault();
    userLogin({
      username: username.value,
      password: password.value,
    });
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username.value}
              onChange={username.onChange}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password.value}
              onChange={password.onChange}
            />
          </label>
        </div>
        <Button variant="contained">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
