import axios from "axios";

const baseURL = "http://localhost:3003/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const response = await axios.get(baseURL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const addBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseURL, newObject, config);
  return response.data;
};

const updateBlog = async (updatedObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(
    `${baseURL}/${updatedObject.id}`,
    updatedObject,
    config,
  );
  return response.data;
};

const deleteBlog = async (blogToDelete) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseURL}/${blogToDelete.id}`, config);

  return response.data;
};

export default { getAll, addBlog, updateBlog, deleteBlog, setToken };
