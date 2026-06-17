import { useState } from "react";

const BlogEntry = (props) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog">
      <h4>{props.blog.title}</h4>
      <h4>{props.blog.author}</h4>
      {visible ? (
        <div>
          <p>{props.blog.url}</p>
          <p>Likes: {props.blog.likes}</p>
          <button
            onClick={() => {
              props.handleLikes(event, props.blog);
            }}
          >
            Like
          </button>
          <br />
          {props.blog.user.name} <br />
          {props.isOwner && (
            <button
              onClick={() => {
                props.handleDelete(event, props.blog);
              }}
            >
              Delete
            </button>
          )}
        </div>
      ) : (
        ""
      )}
      <br />
      <button
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {visible ? "Hide" : "View"}
      </button>
    </div>
  );
};

export default BlogEntry;
