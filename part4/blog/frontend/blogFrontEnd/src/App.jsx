import { useState, useEffect } from "react";
import blogServices from "./services/blogServices";

function App() {
  const [blogsList, setBlogsList] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");
  const [newLikes, setNewLikes] = useState("");

  useEffect(() => {
    blogServices.getAll().then((response) => {
      setBlogsList(response);
    });
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleURLChange = (event) => {
    setNewURL(event.target.value);
  };
  const handleLikeChange = (event) => {
    setNewLikes(event.target.value);
  };

  return (
    <>
      <h1>Blog List App</h1>
      <h2>Add a blog here:</h2>
      <form onSubmit={addBlog}>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={handleTitleChange}
          value={newTitle}
        />{" "}
        <br></br>
        <label htmlFor="author">Author: </label>
        <input
          type="text"
          name="author"
          onChange={handleAuthorChange}
          value={newAuthor}
        />{" "}
        <br></br>
        <label htmlFor="url">Link: </label>
        <input
          type="url"
          name="url"
          onChange={handleURLChange}
          value={newURL}
        />{" "}
        <br></br>
        <label htmlFor="likes">Likes: </label>
        <input
          type="number"
          name="likes"
          onChange={handleLikeChange}
          value={newLikes}
        />
        <br></br>
        <br></br>
        <button type="submit">Submit</button>
      </form>
      <div>
        {blogsList.length > 0
          ? blogsList.map((blog) => {
              return (
                <div key={blog.id}>
                  <h3>{blog.title}</h3>
                  <h5>Author: {blog.author}</h5>
                  <p>Link: {blog.url}</p>
                  <p>Likes: {blog.likes}</p>
                </div>
              );
            })
          : "None available"}
      </div>
    </>
  );
}

export default App;
