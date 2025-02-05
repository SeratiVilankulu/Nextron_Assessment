import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Navigation from "../../components/navigation";
// import Modal from "../../components/modal";
import Reviews from "../../components/reviews";
import { formatDistanceToNow } from "date-fns";

const VideoDetails = () => {
	const router = useRouter();
	const {
		videoId,
		title = "",
		description = "",
		videoURL = "",
		createdAt = "",
		fromMyLibrary = "false",
	} = router.query;

	const [user, setUser] = useState(null); // State to store logged in user
	const [editIcon, setShowEditIcon] = useState(false);
	const [actions, setShowActions] = useState(false);
	const [deleteIcon, setShowDeleteIcon] = useState(false);
	const [updatedVideo, setUpdatedVideo] = useState({
		videoURL,
		title,
		description,
		videoId,
	});
	const [ratingCount, setRatingCount] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	// useEffect(() => {
	// 	if (video) {
	// 		setShowEditIcon(fromMyLibrary === "true"); //Show edit icon in MyLibrary
	// 		setShowDeleteIcon(fromMyLibrary === "true"); //Show delete icon in MyLibrary
	// 		setShowActions(fromMyLibrary === "true"); //Show comment actions icon in MyLibrary
	// 	}
	// }, [fromMyLibrary]);

	// Fetch the Users from the backend
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("http://localhost:5110/api/users");
				setUser(response.data);
			} catch (error) {
				console.error("An error occurred while fetching users", error);
			}
		};

		fetchUsers();
	}, []);

	// Fetch video details from the backend
	useEffect(() => {
		if (videoId) {
			// Fetch video details from the backend
			axios
				.get(`http://localhost:5110/api/video/${videoId}`)
				.then((response) => setUpdatedVideo(response.data))
				.catch((error) =>
					console.error("Error fetching video details:", error)
				);
		}
	}, [videoId]);

	const deleteVideo = async (id) => {
		try {
			await axios.delete(`http://localhost:5110/api/video/${videoId}`);
			setTimeout(() => router.push("/home"), 1000);
		} catch (error) {
			console.error("An error occurred while deleting the video", error);
		}
	};

	// Function to play video
	const playVideo = () => {
		setIsPlaying(true);
	};

	const updateVideoDetails = (newDetails) => {
		setUpdatedVideo((prevImage) => ({
			...prevImage,
			...newDetails,
		}));
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

													<div className="replyContainer">
														<i className="bi bi-chat-right"></i>
														{ratingCount >= 0 && <span>{ratingCount}</span>}
														<i
															className="bi bi-star-fill"
															onClick={() => setOpenModal(true)}
														></i>
													</div>
													{deleteIcon && (
														<i
															onClick={() => deleteVideo(videoId)}
															className="bi bi-trash3"
														></i>
													)}
												</div>
												<div className="userProfile">
													<p>UserImage</p>
													<h3>UserName</h3>
												</div>
											</div>
											{editIcon && (
												<i
													className="bi bi-pencil-fill"
													onClick={() => setOpenModal(true)}
												></i>
											)}
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
											{editIcon && (
												<i
													className="bi bi-pencil-fill"
													onClick={() => setOpenModal(true)}
												></i>
											)}
											<p>{updatedVideo.description}</p>
											<div className="icons">
												<div className="actionsContainer">
													<i className="bi bi-chat-right"></i>
													{ratingCount >= 0 && <span>{ratingCount}</span>}
												</div>
												{deleteIcon && (
													<i
														onClick={() => deleteVideo(videoId)}
														className="bi bi-trash3"
													></i>
												)}
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				{/* Comments and Modal Components */}
				<Reviews videoId={updatedVideo.videoId} actions={actions} />
				{/* <Modal closeModal={() => setOpenModal(false)}/> */}
			</div>
		</React.Fragment>
	);
};

export default VideoDetails;
