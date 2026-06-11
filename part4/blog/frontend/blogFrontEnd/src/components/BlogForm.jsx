const BlogForm = ({
  addBlog,
  setNewTitle,
  newTitle,
  setNewAuthor,
  newAuthor,
  setNewURL,
  newURL,
  setNewLikes,
  newLikes,
}) => {
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
          onChange={({ target }) => setNewAuthor(target.value)}
          value={newAuthor}
        />{" "}
        <br></br>
        <label htmlFor="url">Link: </label>
        <input
          type="url"
          name="url"
          onChange={({ target }) => setNewURL(target.value)}
          value={newURL}
        />{" "}
        <br></br>
        <label htmlFor="likes">Likes: </label>
        <input
          type="number"
          name="likes"
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
