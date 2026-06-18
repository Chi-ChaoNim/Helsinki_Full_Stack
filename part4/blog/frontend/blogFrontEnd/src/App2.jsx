import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";

import blogServices from "./services/blogServices";
import loginServices from "./services/loginServices";

import Home from "./components/Home";
import Login from "./components/Login";
import BlogForm from "./components/BlogForm";
import BlogEntry from "./components/BlogEntry";
import Notification from "./components/Notification";

const App2 = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
  });

  useEffect(() => {
    if (user) {
      blogServices.setToken(user.token);
    }
  }, [user]);

  useEffect(() => {
    blogServices.getAll().then((response) => {
      setBlogsList(response);
    });
  }, []);

  const notifiTimeout = setTimeout(() => setNotification(null), 5000);

  const addBlog = (newBlogObject) => {
    blogServices
      .addBlog(newBlogObject)
      .then((response) => {
        setBlogsList(blogsList.concat(response));
        setNotification({
          text: `A new blog: "${response.title} by ${response.author}" added`,
          type: "success",
        });
        notifiTimeout;
        navigate("/");
      })
      .catch((error) => {
        setNotification({
          text: `Failed to add blog: ${error.response?.data?.error || error.message || String(error)}`,
          type: "error",
        });
        notifiTimeout;
      });
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    setNotification({ text: `Successfully logged out`, type: "success" });
    notifiTimeout;
    navigate("/");
  };

  const handleLikes = (blog) => {
    event.preventDefault();
    const updatedObject = {
      ...blog,
      likes: blog.likes + 1,
    };
    blogServices
      .updateBlog(updatedObject)
      .then((response) => {
        setBlogsList(
          blogsList.map((blog) => (blog.id === response.id ? response : blog)),
        );
      })
      .catch((error) => {
        setNotification({
          text: `Failed to update blog: ${error.response?.data?.error || error.message || String(error)}`,
          type: error,
        });
        notifiTimeout;
      });
  };

  const handleDelete = (blogToDelete) => {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete ${blogToDelete.title} by ${blogToDelete.author}`,
      )
    ) {
      blogServices
        .deleteBlog(blogToDelete)
        .then(() => {
          setBlogsList(blogsList.filter((blog) => blog.id !== blogToDelete.id));
          setNotification({
            text: `Successfully deleted blog`,
            type: "success",
          });
          notifiTimeout;
          navigate("/");
        })
        .catch((error) => {
          setNotification({
            text: `Failed to delete blog: ${error.response?.data?.error || error.message || String(error)}`,
            type: "error",
          });
          notifiTimeout;
        });
    }
  };
  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginServices.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogServices.setToken(user.token);
      setUser(user);
      setNotification({ text: `Successfully logged in`, type: "success" });
      notifiTimeout;
      navigate("/");
    } catch (error) {
      setNotification({
        text: `Failed to login: ${error.response?.data?.error || error.message || String(error)}`,
        type: "error",
      });
      notifiTimeout;
    }
  };

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Container>
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
      <Notification notification={notification} />
      <Routes>
        <Route path="/" element={<Home blogsList={blogsList} />} />
        <Route path="/create" element={<BlogForm blogCreation={addBlog} />} />
        <Route
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
              setNotificationMessage={setNotification}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogEntry
              user={user}
              blogs={blogsList}
              handleLikes={handleLikes}
              handleDelete={handleDelete}
            />
          }
        />
      </Routes>
    </Container>
  );
};

export default App2;
