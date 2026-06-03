import axios from "axios";

const baseURL = "/api/persons";

const getAll = async () => {
  try {
    const request = axios.get(baseURL);
    return request.then((response) => response.data);
  } catch (error) {
    console.error(error);
  }
};

const create = async (newObject) => {
  try {
    const request = axios.post(baseURL, newObject);
    return request.then((response) => response.data);
  } catch (error) {
    console.error(error);
  }
};

const update = async (id, newObject) => {
  try {
    const request = axios.put(`${baseURL}/${id}`, newObject);
    return request.then((response) => response.data);
  } catch (error) {
    console.error(error);
  }
};

const deleteRecord = async (id) => {
  try {
    const request = axios.delete(`${baseURL}/${id}`);
    return request.then((response) => {
      return response.data;
    });
  } catch (error) {
    console.log(error);
  }
};

export default { getAll, create, update, deleteRecord };
