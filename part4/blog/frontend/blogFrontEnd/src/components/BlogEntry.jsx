import { useParams } from "react-router-dom";

const BlogEntry = ({ user, blogs, handleLikes, handleDelete }) => {
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
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
      <h4>{blog.title}</h4>
      <h4>{blog.author}</h4>

      <div>
        <p>{blog.url}</p>
        <p>Likes: {blog.likes}</p>
        {user && (
          <button
            onClick={() => {
              handleLikes(blog);
            }}
          >
            Like
          </button>
        )}
        <br />
        Added by {blog.user.name} <br />
        {isOwner && (
          <button
            onClick={() => {
              handleDelete(blog);
            }}
          >
            Delete
          </button>
        )}
      </div>
      <br />
    </div>
  );
};

export default BlogEntry;
