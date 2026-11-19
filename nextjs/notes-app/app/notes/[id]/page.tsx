import { notFound } from "next/navigation";
import { getNoteById } from "../../services/notes";
import { toggleNoteImportance } from "@/app/actions/notes";
import { Suspense } from "react";

const Note = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const note = await getNoteById(Number(id));

  if (!note) {
    notFound();
  }

  return (
    <div>
      <h2>{note.content}</h2>
      <p>{note.important ? "Important" : "Not Important"}</p>
      <form action={toggleNoteImportance}>
        <input type="hidden" name="id" value={note.id} />
        <button type="submit">
          {note.important ? "Mark as not important" : "Mark as important"}
        </button>
      </form>
    </div>
  );
};

const NotePage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div>
      <Suspense fallback={<p>Loading note...</p>}>
        <Note params={params} />
      </Suspense>
    </div>
  );
};

export default NotePage;
