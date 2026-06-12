import { useState, useEffect, useRef } from "react";
import blogServices from "./services/blogServices";
import loginServices from "./services/loginServices";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Toggleable from "./components/Toggleable";

function App() {
  const [blogsList, setBlogsList] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationSuccess, setNotificationSuccess] = useState(true);

  useEffect(() => {
    blogServices.getAll().then((response) => {
      setBlogsList(response);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogServices.setToken(user.token);
    }
  }, []);

  const addBlog = (newBlogObject) => {
    blogFormRef.current.toggleVisibility();
    blogServices
      .addBlog(newBlogObject)
      .then((response) => {
        setBlogsList(blogsList.concat(response));
        setNotificationSuccess(true);
        setNotificationMessage(
          `Added a blog: ${newBlogObject.title} // ${newBlogObject.author}`,
        );
        setTimeout(() => setNotificationMessage(null), 5000);
      })
      .catch((error) => {
        setNotificationSuccess(false);
        setNotificationMessage(`Failed to add blog: ${error}`);
        setTimeout(() => setNotificationMessage(null), 5000);
      });
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginServices.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogServices.setToken(user.token);
      setUser(user);
      setNotificationSuccess(true);
      setNotificationMessage(`Successfully logged in`);
      setTimeout(() => setNotificationMessage(null), 5000);
    } catch (error) {
      setNotificationSuccess(false);
      setNotificationMessage(`Failed to login: ${error}`);
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    setNotificationSuccess(true);
    setNotificationMessage(`Successfully logged out`);
  };

  const handleLikes = (event, blog) => {
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
        setNotificationMessage(`Failed to update blog: ${error}`);
        setTimeout(() => setNotificationMessage(null), 5000);
      });
  };

  const handleDelete = (event, blogToDelete) => {
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
        })
        .catch((error) => {
          setNotificationSuccess(false);
          setNotificationMessage(`Failed to delete blog: ${error}`);
          setTimeout(() => setNotificationMessage(null), 5000);
        });
    }
  };
  const loginForm = () => (
    <Toggleable buttonLabel="Login">
      <LoginForm userLogin={handleLogin} />
    </Toggleable>
  );

  const blogFormRef = useRef();

  const blogForm = () => (
    <Toggleable buttonLabel="New blog" ref={blogFormRef}>
      <BlogForm blogCreation={addBlog} />
    </Toggleable>
  );

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <>
      <h1>Blog List App</h1>
      <Notification
        message={notificationMessage}
        notificationSuccess={notificationSuccess}
      />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          {blogForm()}
          <div>
            {blogsList.length > 0
              ? blogsList
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => {
                    return (
                      <div key={blog.id} style={blogStyle}>
                        <h4>
                          {blog.title} // {blog.author}
                          <Toggleable buttonLabel="View" buttonHide="Hide">
                            {blog.url}
                            <br />
                            Likes: {blog.likes}{" "}
                            <button
                              onClick={(event) => {
                                handleLikes(event, blog);
                              }}
                            >
                              Like
                            </button>
                            <br />
                            {blog.user.name}
                            <br />
                            <button
                              onClick={() => {
                                handleDelete(event, blog);
                              }}
                            >
                              Delete
                            </button>
                            <br />
                          </Toggleable>
                        </h4>
                      </div>
                    );
                  })
              : "None available"}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
