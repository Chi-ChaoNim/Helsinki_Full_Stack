import { getNotes } from "../services/notes";
import Link from "next/link";
import { Suspense } from "react";

const NotesList = async ({
  searchParams,
}: {
  searchParams: Promise<{ important?: string }>;
}) => {
  const { important } = await searchParams;
  const showImportant = important === "true";
  const notes = await getNotes(showImportant);

  return (
    <>
      <div>
        <Link href={showImportant ? "/notes" : "/notes?important=true"}>
          {showImportant ? "Show All" : "Show Important"}
        </Link>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link href={`/notes/${note.id}`}>{note.content}</Link>
            {note.important && <strong> (important)</strong>}
          </li>
        ))}
      </ul>
    </>
  );
};

const Notes = ({
  searchParams,
}: {
  searchParams: Promise<{ important?: string }>;
}) => {
  return (
    <div>
      <h2>Notes</h2>
      <Suspense fallback={<p>Loading notes...</p>}>
        <NotesList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Notes;
