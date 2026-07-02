import { useContext } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Container } from "@mui/material";

import blogServices from "./services/blogServices";
import loginServices from "./services/loginServices";
import userServices from "./services/userServices";
import localUser from "./services/persistentUser";

import NotificationContext from "./NotificationContext";
import UserContext from "./UserContext";

import Home from "./components/Home";
import Login from "./components/Login";
import BlogForm from "./components/BlogForm";
import BlogEntry from "./components/BlogEntry";
import ErrorBoundary from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import UserList from "./components/UserList";
import UserEntry from "./components/UserEntry";

const App2 = () => {
  const queryClient = useQueryClient();

  const { notifiPositive, notifiNegative } = useContext(NotificationContext);
  const { setUser } = useContext(UserContext);

  const blogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogServices.getAll,
  });

  const usersResult = useQuery({
    queryKey: ["users"],
    queryFn: userServices.getAll,
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

  const commentBlogMutation = useMutation({
    mutationFn: ({ comment, blogId }) =>
      blogServices.commentBlog({ content: comment }, blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notifiPositive("Successfully commented on blog");
    },
    onError: (error) => {
      notifiNegative("Failed to comment", error);
    },
  });

  const navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginServices.login({ username, password });

      localUser.saveUser("loggedBlogappUser", user);
      blogServices.setToken(user.token);
      setUser(user);
      notifiPositive("Successfully logged in");
      navigate("/");
    } catch (error) {
      notifiNegative("Failed to login", error);
    }
  };

  const handleLogout = () => {
    localUser.removeUser("loggedBlogappUser");
    setUser(null);
    notifiPositive("Successfully logged out");
    navigate("/");
  };

  const addBlog = (newBlogObject) => {
    newBlogMutation.mutate(newBlogObject);
    navigate("/");
  };

  const handleLikes = (event, blog) => {
    event.preventDefault();
    const updatedObject = {
      ...blog,
      likes: blog.likes + 1,
    };
    likeBlogMutation.mutate(updatedObject);
  };

  const handleDelete = (event, blogToDelete) => {
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

  const handleComments = (event, comment, blog) => {
    event.preventDefault();
    commentBlogMutation.mutate({ comment, blogId: blog.id });
  };

  if (blogsResult.isPending || usersResult.isPending) {
    return <div>Loading data...</div>;
  }

  const blogsList = blogsResult.data;
  const userList = usersResult.data;

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
                handleComments={handleComments}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path="/users"
          element={
            <ErrorBoundary>
              <UserList users={userList} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ErrorBoundary>
              <UserEntry users={userList} />
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<h2>404: Page not found</h2>} />
      </Routes>
    </Container>
  );
};

export default App2;
