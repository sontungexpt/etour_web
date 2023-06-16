import axios from "axios";

const defaultOptions = {
	headers: {
		"Content-Type": "application/json",
	},
};

let apiInstance = axios.create(defaultOptions);

apiInstance.interceptors.request.use(function (config) {
	const token = localStorage.getItem("accessToken");
	config.headers.Authorization = `Bearer ${token}`;

	return config;
});

export default apiInstance;
