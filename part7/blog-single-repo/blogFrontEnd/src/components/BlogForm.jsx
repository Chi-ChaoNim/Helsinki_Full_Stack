import { Button, TextField } from "@mui/material";
import useField from "../hooks/useField";

const BlogForm = ({ blogCreation }) => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");

  const addBlog = (event) => {
    event.preventDefault();
    blogCreation({
      title: title.value,
      author: author.value,
      url: url.value,
      likes: 0,
    });
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
          onChange={title.onChange}
          value={title.value}
        />{" "}
        <br></br>
        <TextField
          fullWidth
          variant="outlined"
          label="Author"
          id="author"
          size="small"
          margin="dense"
          onChange={author.onChange}
          value={author.value}
        />{" "}
        <br></br>
        <TextField
          fullWidth
          variant="outlined"
          label="URL"
          size="small"
          margin="dense"
          id="url"
          onChange={url.onChange}
          value={url.value}
        />{" "}
        <br></br>
        <Button variant="contained" type="submit">
          Create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
