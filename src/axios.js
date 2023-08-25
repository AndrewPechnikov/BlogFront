import axios from "axios";



const instance = axios.create({
	baseURL: "https://pet-blog-ua-01859ab07cf7.herokuapp.com" //базова частина URL
})

instance.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem("token")
	return config
})



export default instance