import { eq } from "drizzle-orm";
import { db } from "../../db";
import { notes } from "../../db/schema";
import { getCurrentUser } from "./session";

export const getNotes = async (importantOnly?: boolean) => {
  if (importantOnly) {
    return db.query.notes.findMany({
      where: eq(notes.important, true),
    });
  }
  return db.query.notes.findMany();
};

export const addNote = async (content: string, important: boolean) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not logged in");
  }

  await db.insert(notes).values({ content, important, userID: user.id });
};

export const toggleImportance = async (id: number) => {
  const note = await getNoteById(id);
  if (note) {
    await db
      .update(notes)
      .set({ important: !note.important })
      .where(eq(notes.id, id));
  }
};

export const getNoteById = async (id: number) => {
  return db.query.notes.findFirst({
    where: eq(notes.id, id),
  });
};
