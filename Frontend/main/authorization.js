export function getLoggedInUser() {
	if (typeof window !== "undefined") {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : null;
	}
	return null;
}
