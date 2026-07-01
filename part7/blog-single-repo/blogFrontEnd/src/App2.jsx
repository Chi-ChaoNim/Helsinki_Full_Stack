import { useContext } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Container } from "@mui/material";

import blogServices from "./services/blogServices";
import loginServices from "./services/loginServices";

import NotificationContext from "./NotificationContext";
import UserContext from "./UserContext";

import Home from "./components/Home";
import Login from "./components/Login";
import BlogForm from "./components/BlogForm";
import BlogEntry from "./components/BlogEntry";
import ErrorBoundary from "./components/ErrorBoundary";
import { Header } from "./components/Header";

const App2 = () => {
  const queryClient = useQueryClient();

  const { notifiPositive, notifiNegative } = useContext(NotificationContext);
  const { setUser } = useContext(UserContext);

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogServices.getAll,
  });

  const newBlogMutation = useMutation({
    mutationFn: blogServices.addBlog,
    onSuccess: (newBlogObject) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notifiPositive(
        `A new blog: "${newBlogObject.title} by ${newBlogObject.author}" added`,
      );
    },
    onError: (error) => {
      notifiNegative("Failed to add blog", error);
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: blogServices.updateBlog,
    onSuccess: (updatedObject) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notifiPositive(`Liked a blog: ${updatedObject.title}`);
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

  if (result.isPending) {
    return <div>Loading data...</div>;
  }

  const blogsList = result.data;

  return (
    <Container>
      <Header handleLogout={handleLogout} />
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
              <Login handleLogin={handleLogin} handleLogout={handleLogout} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ErrorBoundary>
              <BlogEntry
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
