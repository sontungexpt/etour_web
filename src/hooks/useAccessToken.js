export default function useAccessToken() {
	const token = localStorage.getItem("accessToken");
	// if (!token) throw new Error("accessToken not found");
	return token;
}
