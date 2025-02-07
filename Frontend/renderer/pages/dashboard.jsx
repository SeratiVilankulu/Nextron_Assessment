import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import Navigation from "../components/navigation";
import { formatDistanceToNow } from "date-fns";
import { getLoggedInUser } from "../../main/authorization";

const Dashboard = () => {
	const [video, setVideos] = useState([]); // State to store fetched videos
	const [currentPage, setCurrentPage] = useState(1); // Number of videos to display per page
	const videosPerPage = 100;
	const [loading, setLoading] = useState(false); // Track loading state
	const router = useRouter(); 
	const videoContainerRef = useRef(null);
	const [user, setUser] = useState(null); // State to store logged in user

	useEffect(() => {
		const loggedInUser = getLoggedInUser();
		if (loggedInUser) {
			setUser(loggedInUser);
		} else {
			window.location.href = "/login"; // Redirect to login if no user
		}
	}, []);

	// Fetch the uploaded thumbnails from the backend
	useEffect(() => {
		const fetchVideoThumbnails = async () => {
			try {
				const response = await axios.get("http://localhost:5110/api/video");
				setVideos(response.data);
			} catch (error) {
				console.error("An error occurred while fetching videos", error);
			}
		};

		fetchVideoThumbnails();
	}, []);

	//Function to handel thumbnail click and navigate to video detail
	const thumbnailClick = (video) => {
		if (video.videoId) {
			router.push(`/video/${video.videoId}`);
		}
	};

	// Calculate the indexes for the videos to display on the current page
	const indexOfLastVideo = currentPage * videosPerPage;
	const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
	const currentVideos = video.slice(indexOfFirstVideo, indexOfLastVideo);

	// Fetch more videos as the user scrolls
	const fetchMoreVideos = () => {
		if (loading) return; // Prevent multiple fetches at once

		setLoading(true);
		setTimeout(() => {
			setVideos((prevVideos) => [...prevVideos]);
			setLoading(false);
			setCurrentPage((prevPage) => prevPage + 1);
		}, 500); // Simulate network delay
	};

	// Scroll event listener to trigger fetchMoreVideos when user reaches the bottom
	const handleScroll = () => {
		const container = videoContainerRef.current;
		if (
			container &&
			container.scrollHeight - container.scrollTop === container.clientHeight
		) {
			fetchMoreVideos();
		}
	};

	useEffect(() => {
		const container = videoContainerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener("scroll", handleScroll);
			}
		};
	}, [loading]);

	return (
		<React.Fragment>
			<Head>
				<title>Streamify Home</title>
			</Head>
			<div className="mainContainer p-2">
				<Navigation />

				<div
					className={`videoContainer ${
						currentVideos.length === 0 ? "noVideos" : ""
					}`}
					ref={videoContainerRef}
				>
					{currentVideos.length > 0 ? (
						currentVideos.map((video) => (
							<div className="videoGrid" key={video.id}>
								<div className="videoCard">
									<Image
										src={video.thumbnailURL}
										className="videoThumbnail"
										onClick={() => thumbnailClick(video)}
										alt={video.title}
										width={300}
										height={200}
									/>
									<div className="videoContent">
										<div className="videoTitle">
											<p>{video.title}</p>
											<i className="bi bi-chat-left comment"></i>
										</div>
										<div className="rating">
											<span className="ratingCount">3</span>
											{video.rating} <i className="bi bi-star-fill"></i>
										</div>
										<div className="videoDetails">
											<span className="creatorName">
												{video.creatorUserName}
											</span>
											<span className="videoDate">
												{formatDistanceToNow(new Date(video.createdAt))} ago
											</span>
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="noVideo">No videos have been uploaded yet.</div>
					)}
					{loading && <p>Loading more...</p>}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Dashboard;
