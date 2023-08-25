import axios from "axios";



const instance = axios.create({
	baseURL: "https://mern-pet-blog.onrender.com/" //базова частина URL
})

instance.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem("token")
	return config
})



export default instance