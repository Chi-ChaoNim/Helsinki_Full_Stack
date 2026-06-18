import { useState } from "react";
import { Button, TextField } from "@mui/material";

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
      likes: Number(newLikes),
    });

    setNewTitle("");
    setNewAuthor("");
    setNewURL("");
    setNewLikes(0);
  };

  return (
    <div>
      <h2>Create blog</h2>
      <form onSubmit={addBlog}>
        <TextField
          fullWidth
          variant="outlined"
          label="Title"
          id="title"
          size="small"
          margin="dense"
          onChange={({ target }) => setNewTitle(target.value)}
          value={newTitle}
        />{" "}
        <br></br>
        <TextField
          fullWidth
          variant="outlined"
          label="Author"
          id="author"
          size="small"
          margin="dense"
          onChange={({ target }) => setNewAuthor(target.value)}
          value={newAuthor}
        />{" "}
        <br></br>
        <TextField
          fullWidth
          variant="outlined"
          label="URL"
          size="small"
          margin="dense"
          id="url"
          onChange={({ target }) => setNewURL(target.value)}
          value={newURL}
        />{" "}
        <br></br>
        {/* <label htmlFor="likes">Likes: </label>
        <input
          type="number"
          name="likes"
          id="likes"
          onChange={({ target }) => setNewLikes(Number(target.value))}
          value={newLikes}
        /> */}
        <Button variant="contained" type="submit">
          Create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
