const baseUrl = "http://localhost:3001/anecdotes";

export const getAll = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }

  return await response.json();
};

export const createNew = async (newAnecdote) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAnecdote),
  };

  const response = await fetch(baseUrl, options);

  if (response.status === 400) {
    const reply = await response.json();
    throw new Error(reply.error);
  } else if (!response.ok) {
    throw new Error("Failed to create anecdote");
  }

  return await response.json();
};

export const updatedAnecdote = async (updatedAnecdote) => {
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAnecdote),
  };

  const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, options);

  if (!response.ok) {
    throw new Error("Failed to update anecdote");
  }

  return await response.json();
};
