import axios from "axios"

const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"

const getAll = async () => {
    try {
        const request = axios.get(`${baseURL}/all`)
        return request.then(response => response.data)
    } catch (error) {
        console.error(error)
    }
    
}

export default {getAll}