import { useState, useEffect } from "react";
import blogServices from "./services/blogServices";
import loginServices from "./services/loginServices";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

function App() {
  const [blogsList, setBlogsList] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");
  const [newLikes, setNewLikes] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const addBlog = (event) => {
    event.preventDefault();
    const newBlogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
      likes: newLikes,
    };

    blogServices
      .addBlog(newBlogObject)
      .then((response) => {
        setBlogsList(blogsList.concat(response));
        setNewTitle("");
        setNewAuthor("");
        setNewURL("");
        setNewLikes(0);
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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginServices.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogServices.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
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

  return (
    <>
      <h1>Blog List App</h1>
      <Notification
        message={notificationMessage}
        notificationSuccess={notificationSuccess}
      />
      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <div>
            {blogsList.length > 0
              ? blogsList.map((blog) => {
                  return (
                    <div key={blog.id}>
                      <h4>
                        {blog.title} // {blog.author}
                      </h4>
                    </div>
                  );
                })
              : "None available"}
          </div>
          <BlogForm
            addBlog={addBlog}
            setNewTitle={setNewTitle}
            newTitle={newTitle}
            setNewAuthor={setNewAuthor}
            newAuthor={newAuthor}
            setNewURL={setNewURL}
            newURL={newURL}
            setNewLikes={setNewLikes}
            newLikes={newLikes}
          />
        </div>
      )}
    </>
  );
}

export default App;
