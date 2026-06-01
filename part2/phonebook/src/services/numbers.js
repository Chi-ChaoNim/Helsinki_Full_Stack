import axios from "axios"

const baseURL = "http://localhost:3001/persons"

const getAll = async () => {
    try {
        const request = axios.get(baseURL)
        return request.then(response => response.data)
    } catch (error) {
        console.error(error)
    } finally {
        console.log("Request 'getAll' completed")
    }
};

const create = async (newObject) => {
    try {
        const request = axios.post(baseURL, newObject)
        return request.then(response => response.data)
    } catch (error) {
        console.error(error)
    } finally {
        console.log("Request 'create' complete")
    }
};

const update = async (id, newObject) => {
    try {
        const request = axios.put(`${baseURL}/${id}`, newObject)
        return request.then(response => response.data)
    } catch (error) {
        console.error(error)
    } finally {
        console.log("Request 'update' complete")
    }
};
   
const deleteRecord = async (id) => {
    try {
        const request = axios.delete(`${baseURL}/${id}`)
        return request.then(response => {
            console.log("🚀 ~ deleteRecord ~ response.data:", response.data)
            return response.data;
        })
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Request 'deleteRecord' complete")
    }
} 

export default {getAll, create, update, deleteRecord}