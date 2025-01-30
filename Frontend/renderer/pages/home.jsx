import React, { useState, useEffect, useNavigate } from "react";
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/navigation'


export default function HomePage() {
  const [message, setMessage] = React.useState('No message found')
  const [video, setVideos] = useState([]); // State to store fetched videos
	const [currentPage, setCurrentPage] = useState(1); // Number of images to display per page
	const videosPerPage = 6;
	const [loading, setLoading] = useState(false); // Track loading state
	// const navigate = useNavigate();

	// Calculate the indexes for the images to display on the current page
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

	// Scroll event listener to trigger fetchMoreVideos when user reaches bottom
	const handleScroll = (event) => {
		const bottom =
			event.target.scrollHeight ===
			event.target.scrollTop + event.target.clientHeight;
		if (bottom) {
			fetchMoreVideos();
		}
	};

	useEffect(() => {
		// Attach scroll event listener
		const videoContainer = document.querySelector(".videoContainer");
		if (videoContainer) {
			videoContainer.addEventListener("scroll", handleScroll);
		}

		// Clean up event listener when component is unmounted
		return () => {
			if (videoContainer) {
				videoContainer.removeEventListener("scroll", handleScroll);
			}
		};
	}, [loading]);

  React.useEffect(() => {
    window.ipc.on('message', (message) => {
      setMessage(message)
    })
  }, [])

  return (
		<React.Fragment>
			<div className="mainContainer p-2">
				<Navigation />

				<div className="videoContainer">
					{currentVideos.length > 0 ? (
						currentVideos.map((image) => (
							<div className="videoCard" key={image.id}>
								<img
									src={image.imageURL}
									className="image"
									onClick={() => imageClick(image)}
									alt={image.title}
								/>
								<div className="overlay">
									<h2>{image.title}</h2>
								</div>
								<i className="bi bi-chat-left comment"></i>
							</div>
						))
					) : (
						<p className="noImage">No images found for the selected tag.</p>
					)}
					{loading && <p>Loading more...</p>}
				</div>
			</div>
		</React.Fragment>
	);
}
