import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getLoggedInUser } from "../../main/authorization";

const Navigation = () => {
	const [user, setUser] = useState(null); // State to store logged in user
  const router = useRouter();

	useEffect(() => {
		const loggedInUser = getLoggedInUser();
		if (loggedInUser) {
			setUser(loggedInUser);
			console.log(loggedInUser);
		} else {
			window.location.href = "/login"; // Redirect to login if no user
		}
	}, []);

	//Function to handel logout
	const Logout = () => {
			router.push(`/home`);
	};

	return (
		<div className="navigationContainer">
			<div className="logo">
				<img src="/images/playerLogo.svg" alt="Logo" />
				<span>Streamify</span>
			</div>
			<div className="options">
				<ul>
					<li>
						<Link href="/dashboard">Home</Link>
					</li>
					<li>
						<Link href="/upload">Upload</Link>
					</li>
					<li>
						<Link href="/posts">My Posts</Link>
					</li>
				</ul>
			</div>
			<div className="profile">
				<i className="bi bi-person-circle"></i>
				<div className="details">
					{user ? (
						<p className="name">{user.userName}</p>
					) : (
						<p className="name">Loading...</p>
					)}
				</div>
				<hr />
				<div>
					<button
						className="logOutButton"
						onClick={() => Logout()}
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
