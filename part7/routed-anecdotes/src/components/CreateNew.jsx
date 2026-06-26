import { useNavigate } from "react-router-dom";
import { useField } from "../hooks/useField";

const CreateNew = ({ addAnecdote }) => {
  const content = useField("content");
  const author = useField("author");
  const info = useField("info");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnecdote({
      content: content.methods.value,
      author: author.methods.value,
      info: info.methods.value,
      votes: 0,
    });
    navigate("/");
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.methods} />
        </div>
        <div>
          author
          <input {...author.methods} />
        </div>
        <div>
          url for more info
          <input {...info.methods} />
        </div>
        <button type="submit">create</button>
        <button
          type="reset"
          onClick={() => {
            content.resetValues();
            author.resetValues();
            info.resetValues();
          }}
        >
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
