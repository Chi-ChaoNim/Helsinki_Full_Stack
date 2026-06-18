import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

const BlogEntry = ({ user, blogs, handleLikes, handleDelete }) => {
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
    return <p>Loading...</p>;
  }

  const isOwner = user && blog.user.username === user.username;

  return (
    <div style={blogStyle} className="blog">
      <h3>{blog.title}</h3>
      <h4>{blog.author}</h4>

      <div>
        <p>{blog.url}</p>
        <br />
        Added by {blog.user.name} <br />
        <p>{blog.likes} likes</p>
        {user && (
          <Button
            color="success"
            variant="outlined"
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={() => {
              handleLikes(blog);
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
            onClick={() => {
              handleDelete(blog);
            }}
          >
            Delete
          </Button>
        )}
      </div>
      <br />
    </div>
  );
};

export default BlogEntry;
