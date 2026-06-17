import { useNavigate, useParams } from "react-router-dom";

const Note = ({ note, toggleImportance, deleteNote }) => {
  const id = useParams().id;
  const navigate = useNavigate();
  // const note = notes.find((n) => n.id === id);
  if (note) {
    const label = note.important ? "make not important" : "make important";

    const handleDelete = () => {
      if (window.confirm(`Delete note "${note.content}"?`)) {
        deleteNote(id);
        navigate("/notes");
      }
    };
    return (
      <li className="note">
        <span>{note.content}</span>
        <button onClick={toggleImportance}>{label}</button>
        <button onClick={handleDelete}>Delete</button>
      </li>
    );
  } else {
    return null;
  }
};

export default Note;
