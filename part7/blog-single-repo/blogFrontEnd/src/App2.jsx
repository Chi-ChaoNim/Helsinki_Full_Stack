import { useState, useEffect, useReducer } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
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

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogServices.getAll,
  });

  const newBlogMutation = useMutation({
    mutationFn: blogServices.addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      notifiNegative("Failed to add blog", error);
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: blogServices.updateBlog,
    onSuccess: (newBlogObject) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notifiPositive(
        `A new blog: "${newBlogObject.title} by ${newBlogObject.author}" added`,
      );
    },
    onError: (error) => {
      notifiNegative("Failed to update blog", error);
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogServices.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notifiPositive("Successfully deleted blog");
    },
    onError: (error) => {
      notifiNegative("Failed to delete blog", error);
    },
  });

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
    newBlogMutation.mutate(newBlogObject);
    navigate("/");
  };

  const handleLikes = (blog) => {
    event.preventDefault();
    const updatedObject = {
      ...blog,
      likes: blog.likes + 1,
    };
    likeBlogMutation.mutate(updatedObject);
  };

  const handleDelete = (blogToDelete) => {
    event.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete ${blogToDelete.title} by ${blogToDelete.author}`,
      )
    ) {
      deleteBlogMutation.mutate(blogToDelete);
      navigate("/");
    }
  };

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  if (result.isPending) {
    return <div>Loading data...</div>;
  }

  const blogsList = result.data;

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
