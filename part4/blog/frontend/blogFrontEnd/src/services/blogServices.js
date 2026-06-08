import axios from "axios";

const baseURL = "http://localhost:3003/api/blogs";

const getAll = async () => {
  try {
    const request = axios.get(baseURL);
    return request.then((response) => response.data);
  } catch (error) {
    console.error(error);
  }
};

const addBlog = async (newObject) => {
  try {
    const request = axios.post(baseURL, newObject);
    return request.then((response) => {
      return response.data;
    });
  } catch (error) {
    console.error(error);
  }
};

export default { getAll, addBlog };
