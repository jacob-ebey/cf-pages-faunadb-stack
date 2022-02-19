import { Client, RequestResult, values } from "faunadb";
import { query as q } from "faunadb";

export type Note = {
  id: string;
  title: string;
  body: string;
};

async function getNotesForUser(
  client: Client,
  userId: string
): Promise<Note[]> {
  const result = await client.query<{
    data: {
      ref: values.Ref;
      data: { title: string; body: string; userId: string };
    }[];
  }>(q.Call("GetNotesByUserId", [userId]));

  return result.data.map((item) => ({
    id: item.ref.id,
    title: item.data.title,
    body: item.data.body,
  }));
}

async function createNote(
  client: Client,
  title: string,
  body: string,
  userId: string
): Promise<Note> {
  const result = await client.query<{
    ref: values.Ref;
    data: { title: string; body: string; userId: string };
  }>(q.Call("CreateNote", [title, body, userId]));

  return {
    id: result.ref.id,
    title: result.data.title,
    body: result.data.body,
  };
}

async function deleteNote(client: Client, id: string, userId: string) {
  const result = await client.query(q.Call("DeleteNote", [id, userId]));
  console.log(result);
  return null;
}

export { createNote, deleteNote, getNotesForUser };
