import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

import Notification from "../components/Notification";
import { useContext } from "react";
import UserContext from "../UserContext";

export const Header = ({ handleLogout }) => {
  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  const user = useContext(UserContext);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <h2>Blog App</h2>
          <Button color="inherit" component={Link} to="/" sx={style}>
            Blogs
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/create" sx={style}>
              New blog
            </Button>
          )}
          {user === null ? (
            <Button color="inherit" component={Link} to="/login" sx={style}>
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Notification />
    </div>
  );
};
