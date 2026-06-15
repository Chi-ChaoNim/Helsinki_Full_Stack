import { useState } from "react";

const BlogForm = ({ blogCreation }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");
  const [newLikes, setNewLikes] = useState(0);

  const addBlog = (event) => {
    event.preventDefault();
    blogCreation({
      title: newTitle,
      author: newAuthor,
      url: newURL,
      likes: newLikes,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewURL("");
    setNewLikes(0);
  };

  return (
    <div>
      <h2>Add a blog here:</h2>
      <form onSubmit={addBlog}>
        <label htmlFor="title">Title: </label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={({ target }) => setNewTitle(target.value)}
          value={newTitle}
        />{" "}
        <br></br>
        <label htmlFor="author">Author: </label>
        <input
          type="text"
          name="author"
          id="author"
          onChange={({ target }) => setNewAuthor(target.value)}
          value={newAuthor}
        />{" "}
        <br></br>
        <label htmlFor="url">Link: </label>
        <input
          type="url"
          name="url"
          id="url"
          onChange={({ target }) => setNewURL(target.value)}
          value={newURL}
        />{" "}
        <br></br>
        <label htmlFor="likes">Likes: </label>
        <input
          type="number"
          name="likes"
          id="likes"
          onChange={({ target }) => setNewLikes(target.value)}
          value={newLikes}
        />
        <br></br>
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BlogForm;
