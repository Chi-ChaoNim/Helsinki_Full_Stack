import { createNote } from "@/app/actions/notes";

const newNote = () => {
  return (
    <div>
      <h2>Create a new note</h2>
      <form action={createNote}>
        <div>
          <label>
            Content
            <input type="text" name="content" required />
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="important" />
            Important
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default newNote;
