import { useState, useEffect, useReducer } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";

import blogServices from "./services/blogServices";
import loginServices from "./services/loginServices";

import Home from "./components/Home";
import Login from "./components/Login";
import BlogForm from "./components/BlogForm";
import BlogEntry from "./components/BlogEntry";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";

function notifiReducer(notification, action) {
  switch (action.type) {
    case "success": {
      return { text: action.text, type: action.type };
    }
    case "error": {
      return {
        text: `${action.text}: ${action.error}`,
        type: action.type,
      };
    }
    case "reset": {
      return null;
    }
  }
}

const App2 = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [notification, dispatch] = useReducer(notifiReducer, null);
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

  function notifiPositive(text) {
    dispatch({
      type: "success",
      text,
    });
  }

  function notifiNegative(text, error) {
    dispatch({
      type: "error",
      text,
      error,
    });
  }

  function notifiReset() {
    dispatch({
      type: "reset",
    });
  }

  useEffect(() => {
    setTimeout(() => notifiReset(), 5000);
  }, [notification]);
  //   if (typeof error === "undefined") {
  //     error = null;
  //   }

  //   if (error !== null) {
  //     setNotification({
  //       text: `${text}: ${error.response?.data?.error || error.message || String(error)}`,
  //       type,
  //     });
  //     setTimeout(() => setNotification(null), 5000);
  //   }

  //   setNotification({
  //     text,
  //     type,
  //   });
  //   setTimeout(() => setNotification(null), 5000);
  // };

  const navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginServices.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogServices.setToken(user.token);
      setUser(user);
      notifiPositive("Successfully logged in");
      navigate("/");
    } catch (error) {
      notifiNegative("Failed to login", error);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    notifiPositive("Successfully logged out");
    navigate("/");
  };

  const addBlog = (newBlogObject) => {
    blogServices
      .addBlog(newBlogObject)
      .then((response) => {
        setBlogsList(blogsList.concat(response));
        notifiPositive(
          `A new blog: "${response.title} by ${response.author}" added`,
        );
        navigate("/");
      })
      .catch((error) => {
        notifiNegative("Failed to add blog", error);
      });
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
        notifiNegative("Failed to update blog", error);
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
          notifiPositive("Successfully deleted blog");
          navigate("/");
        })
        .catch((error) => {
          notifiNegative("Failed to delete blog", error);
        });
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
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <Home blogsList={blogsList} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/create"
          element={
            <ErrorBoundary>
              <BlogForm blogCreation={addBlog} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <Login
                user={user}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
              />
            </ErrorBoundary>
          }
        />
        <Route path="/blogs/*" element={<h2>404: Page not found</h2>} />
        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary>
              <BlogEntry
                user={user}
                blogs={blogsList}
                handleLikes={handleLikes}
                handleDelete={handleDelete}
              />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<h2>404: Page not found</h2>} />
      </Routes>
    </Container>
  );
};

export default App2;
