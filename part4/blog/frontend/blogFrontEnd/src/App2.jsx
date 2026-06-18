import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import blogServices from "./services/blogServices";
import loginServices from "./services/loginServices";

import Home from "./components/Home";
import Login from "./components/Login";
import BlogForm from "./components/BlogForm";
import BlogEntry from "./components/BlogEntry";
import Notification from "./components/Notification";

const App2 = () => {
  const [blogsList, setBlogsList] = useState([]);
  const [notificationSuccess, setNotificationSuccess] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(null);
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

  const notifiTimeout = setTimeout(() => setNotificationMessage(null), 5000);

  const addBlog = (newBlogObject) => {
    blogServices
      .addBlog(newBlogObject)
      .then((response) => {
        setBlogsList(blogsList.concat(response));
        setNotificationSuccess(true);
        setNotificationMessage(
          `Added a blog: ${newBlogObject.title} // ${newBlogObject.author}`,
        );
        notifiTimeout;
        navigate("/");
      })
      .catch((error) => {
        setNotificationSuccess(false);
        setNotificationMessage(
          `Failed to add blog: ${error.response?.data?.error || error.message || String(error)}`,
        );
        notifiTimeout;
      });
  };

  const padding = {
    padding: 5,
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    setNotificationSuccess(true);
    setNotificationMessage(`Successfully logged out`);
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
        setNotificationSuccess(false);
        setNotificationMessage(
          `Failed to update blog: ${error.response?.data?.error || error.message || String(error)}`,
        );
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
          setNotificationSuccess(true);
          setNotificationMessage(`Successfully deleted blog`);
          notifiTimeout;
          navigate("/");
        })
        .catch((error) => {
          setNotificationSuccess(false);
          setNotificationMessage(
            `Failed to delete blog: ${error.response?.data?.error || error.message || String(error)}`,
          );
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
      setNotificationSuccess(true);
      setNotificationMessage(`Successfully logged in`);
      notifiTimeout;
      navigate("/");
    } catch (error) {
      setNotificationSuccess(false);
      setNotificationMessage(
        `Failed to login: ${error.response?.data?.error || error.message || String(error)}`,
      );
      notifiTimeout;
    }
  };

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          Blogs
        </Link>
        {user && (
          <Link style={padding} to="/create">
            New blog
          </Link>
        )}
        {user === null ? (
          <Link style={padding} to="/login">
            Login
          </Link>
        ) : (
          <button style={padding} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      <Notification
        message={notificationMessage}
        notificationSuccess={notificationSuccess}
      />
      <Routes>
        <Route path="/" element={<Home blogsList={blogsList} />} />
        <Route path="/create" element={<BlogForm blogCreation={addBlog} />} />
        <Route
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
              setNotificationMessage={setNotificationMessage}
              setNotificationSuccess={setNotificationSuccess}
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
    </div>
  );
};

export default App2;
