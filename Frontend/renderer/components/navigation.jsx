import React from "react";
import Link from "next/link";

const Navigation = () => {
	return (
		<div className="navigationContainer">
			<div className="logo">
				<img src="/images/playerLogo.svg" alt="Logo" />
				<span>Streamify</span>
			</div>
			<div className="options">
				<ul>
					<li>
						<Link href="/home">Home</Link>
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
					<p className="name">User</p>
				</div>
				<hr />
				<div className="profileSettings">
					<i className="bi bi-gear"></i>
					<i className="bi bi-three-dots-vertical"></i>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
