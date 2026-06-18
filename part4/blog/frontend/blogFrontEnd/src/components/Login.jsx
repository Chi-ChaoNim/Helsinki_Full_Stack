import LoginForm from "./LoginForm";

const Login = ({
  user,

  handleLogin,
  handleLogout,
}) => {
  return (
    <div>
      <h1>Login to application</h1>
      {!user && <LoginForm userLogin={handleLogin} />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
