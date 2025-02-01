import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";

const VideoDetails = () => {
	const router = useRouter();
	const { videoId, title, description, videoURL, fromMyLibrary } =
		router.query;

	const [editIcon, setShowEditIcon] = useState(false);
	const [actions, setShowActions] = useState(false);
	const [deleteIcon, setShowDeleteIcon] = useState(false);
	const [updatedVideo, setUpdatedVideo] = useState({
		videoURL,
		title,
		description,
		id: videoId,
	});
	const [commentsCount, setCommentsCount] = useState(0);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		setShowEditIcon(fromMyLibrary === "true");
		setShowDeleteIcon(fromMyLibrary === "true");
		setShowActions(fromMyLibrary === "true");
	}, [fromMyLibrary]);

	const deleteVideo = async (id) => {
		try {
			await axios.delete(`http://localhost:5110/api/video/${id}`);
			setTimeout(() => router.push("/home"), 1000);
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

	if (!updatedVideo.videoURL) {
		return <div>Image not found :(</div>;
	}

	return (
		<div className="container">
			{/* Navigation and other components */}
			<button onClick={() => router.back()}>
				<i className="bi bi-x"></i>
			</button>
			<div className="videoContainer">
				<div className="videoCard" key={updatedVideo.id}>
					<img src={updatedVideo.videoURL} alt={updatedVideo.title} />
					<div className="overlay">
						<h2>{updatedVideo.title}</h2>
						{editIcon && (
							<i
								className="bi bi-pencil-fill"
								onClick={() => setOpenModal(true)}
							></i>
						)}
					</div>
					<p>{updatedVideo.description}</p>
				</div>
			</div>
			<div className="icons">
				<div className="commentContainer">
					<i className="bi bi-chat-right"></i>
					{commentsCount >= 0 && <span>{commentsCount}</span>}
				</div>
				{deleteIcon && (
					<RiDeleteBin6Line onClick={() => deleteVideo(videoId)} />
				)}
			</div>
			{/* Comments and Modal Components */}
		</div>
	);
};

export default VideoDetails;
