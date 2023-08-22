import axios from "axios";

const instance = axios.create({
	baseURL: 'http://localhost:4444' //базова частина URL
})



export default instance