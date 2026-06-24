const baseURL = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await fetch(baseURL);

  if (!response.ok) {
    throw new Error("Failed to fatch anecdotes");
  }

  return await response.json();
};

const createNew = async (content) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, votes: 0 }),
  };
  const response = await fetch(baseURL, options);

  return await response.json();
};

const update = async (id, anecdote) => {
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anecdote),
  };

  const response = await fetch(`${baseURL}/${id}`, options);

  return await response.json();
};

const deleteAnecdote = async (id) => {
  const options = {
    method: "DELETE",
  };
  const response = await fetch(`${baseURL}/${id}`, options);

  return await response.json();
};

export default { getAll, createNew, update, deleteAnecdote };
