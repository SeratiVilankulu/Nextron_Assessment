import React from "react";

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
						<a href="/home">Home</a>
					</li>
					<li>
						<a href="#Upload">Upload</a>
					</li>
					<li>
						<a href="#View">View</a>
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
