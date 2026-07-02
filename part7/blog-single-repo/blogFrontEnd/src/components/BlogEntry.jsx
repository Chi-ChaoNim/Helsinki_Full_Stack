import { useParams } from "react-router-dom";
import { Button, TextField, List, ListItem } from "@mui/material";
import { useContext, useState } from "react";
import UserContext from "../UserContext";

const BlogEntry = ({
  blogs,
  handleLikes,
  handleDelete,
  handleComments,
  user,
}) => {
  const userContext = useContext(UserContext) ?? {};
  const currentUser = user ?? userContext.user;
  const [commentText, setCommentText] = useState("");
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 10,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  if (!blog) {
    return <h2>404: Page not found</h2>;
  }

  const isOwner = currentUser && blog.user.username === currentUser.username;
  const comments = blog.comments ?? [];

  const submitComment = (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      return;
    }
    handleComments(event, commentText.trim(), blog);
    setCommentText("");
  };

  return (
    <div style={blogStyle} className="blog">
      <h3>{blog.title}</h3>
      <h4>{blog.author}</h4>

      <div>
        <p>{blog.url}</p>
        <br />
        Added by {blog.user.name} <br />
        <p>{blog.likes} likes</p>
        {currentUser && (
          <Button
            color="success"
            variant="outlined"
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={(event) => {
              handleLikes(event, blog);
            }}
          >
            Like
          </Button>
        )}
        {isOwner && (
          <Button
            color="error"
            variant="outlined"
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={(event) => {
              handleDelete(event, blog);
            }}
          >
            Delete
          </Button>
        )}
        <h2>Comments</h2>
        <form onSubmit={submitComment}>
          <TextField
            variant="outlined"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a comment"
          />
          <Button type="submit" variant="outlined">
            Add comment
          </Button>
        </form>
        <List>
          {comments.length > 0 ? (
            comments.map((c) => <ListItem key={c.id}>{c.content}</ListItem>)
          ) : (
            <li>No comments yet</li>
          )}
        </List>
      </div>
      <br />
    </div>
  );
};

export default BlogEntry;
