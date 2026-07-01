import axios from "axios";

const baseURL = "http://localhost:3003/api/users";

const getAll = async () => {
  try {
    const response = await axios.get(baseURL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default { getAll };
