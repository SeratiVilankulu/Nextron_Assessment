import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Navigation from "../../components/navigation";
import Reviews from "../../components/reviews";
import { formatDistanceToNow } from "date-fns";
import Modal from "../../components/modal";

const VideoDetails = () => {
	const router = useRouter();
	const {
		videoId,
		title = "",
		description = "",
		videoURL = "",
		MyPosts = "false", // Flag to check if the video is accessed through 'My Posts'
	} = router.query;

	const [user, setUser] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [editIcon, setShowEditIcon] = useState(false);
	const [deleteIcon, setShowDeleteIcon] = useState(false);
	const [updatedVideo, setUpdatedVideo] = useState({
		videoURL,
		title,
		description,
		videoId,
	});
	const [isPlaying, setIsPlaying] = useState(false);
	const [reloadFlag, setReloadFlag] = useState(false); // New state to trigger re-fetch

	useEffect(() => {
		if (videoId) {
			// Fetch video details based on videoId
			axios
				.get(`http://localhost:5110/api/video/${videoId}`)
				.then((response) => {
					setUpdatedVideo(response.data);
					// Check if the logged-in user is the creator of the video
					if (user && user.username === response.data.creatorUserName) {
						// Show edit and delete icons only if user is the creator and accessing from 'My Posts'
						if (MyPosts === "true") {
							setShowEditIcon(true);
							setShowDeleteIcon(true);
						}
					}
				})
				.catch((error) =>
					console.error("Error fetching video details:", error)
				);
		}
	}, [videoId, user, MyPosts, reloadFlag]); // Added reloadFlag as a dependency

	const playVideo = () => {
		setIsPlaying(true);
	};

	const deleteVideo = async (id) => {
		try {
			// Send delete request for the video
			await axios.delete(`http://localhost:5110/api/video/${videoId}`);
			setTimeout(() => router.push("/dashboard"), 1000);
		} catch (error) {
			console.error("An error occurred while deleting the video", error);
		}
	};

	const updateVideoDetails = (newDetails) => {
		setUpdatedVideo((prevImage) => ({
			...prevImage,
			...newDetails,
		}));
	};

	// Function to trigger the re-fetch
	const handleModalClose = () => {
		setOpenModal(false);
		setReloadFlag((prevFlag) => !prevFlag); // Toggle the reloadFlag to trigger useEffect again
	};

	if (!updatedVideo.videoURL) {
		return <div>Video not found :(</div>;
	}

	return (
		<React.Fragment>
			<Head>
				<title>Video Play</title>
			</Head>
			<Navigation />
			<div className="mediaWrapper">
				<div className="container">
					<button className="closeButton">
						<i className="bi bi-x" onClick={() => router.back()}></i>
					</button>
					<div className="videoDetailsContainer">
						<div className="videoDetailsCard" key={updatedVideo.videoId}>
							{!isPlaying ? (
								<div className="thumbnailWrapper">
									<img
										src={updatedVideo.thumbnailURL}
										alt={updatedVideo.title}
									/>
									<button className="playButton" onClick={playVideo}>
										<i className="bi bi-play-circle-fill"></i>
									</button>
									<div className="detailsWrapper">
										<div className="details">
											<div className="userDetails">
												<div className="details1">
													<h2>{updatedVideo.title}</h2>

													<div className="iconsContainer">
														<i
															className="bi bi-pencil-fill"
															onClick={() => setOpenModal(true)}
														></i>
														<i
															onClick={() => deleteVideo(videoId)}
															className="bi bi-trash3"
														></i>
													</div>
												</div>
												<div className="userProfile">
													<p>By:</p>
													<h3>{updatedVideo.creatorUserName}</h3>
												</div>
											</div>

											<div className="description">
												<p>
													{formatDistanceToNow(
														new Date(updatedVideo.createdAt)
													)}{" "}
													ago
												</p>
												<p>{updatedVideo.description}</p>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div>
									<video controls autoPlay>
										<source src={updatedVideo.videoURL} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
									<div className="detailsWrapper">
										<div className="details">
											<h2>{updatedVideo.title}</h2>
											<p>{updatedVideo.description}</p>
											<div className="icons">
												<div className="actionsContainer">
													<i className="bi bi-chat-right"></i>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<Reviews videoId={updatedVideo.videoId} />
				{openModal && (
					<Modal
						closeModal={handleModalClose} 
						defaultValue={updatedVideo}
						id={updatedVideo.videoId}
						updateVideoDetails={updateVideoDetails}
					/>
				)}
			</div>
		</React.Fragment>
	);
};

export default VideoDetails;