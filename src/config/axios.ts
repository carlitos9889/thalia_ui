import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:3000/api",
	timeout: 5000,
	headers: {
		// Authorization: "JWT " + localStorage.getItem("access_token"),
		"Content-Type": "application/json",
		accept: "application/json",
	},
});
