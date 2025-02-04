import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import Navigation from "../components/navigation";
// import { IoIosArrowBack, IoIosArrowForward as IoForward } from "react-icons/io";
// import { MdOutlineChatBubbleOutline } from "react-icons/md";
// import { IoMdImages } from "react-icons/io";

const MyLibrary = () => {
	const [images, setImages] = useState([]); // State to store fetched images
	const [userInfo, setUserInfo] = useState(null);
	const [userID, setUserID] = useState("");
	const [currentPage, setCurrentPage] = useState(1); // State to track the current page
	const imagesPerPage = 4; // Number of images to display per page
	// const navigate = useNavigate();

	useEffect(() => {
		const currentUser = localStorage.getItem("user");
		if (currentUser) {
			const user = JSON.parse(currentUser);
			setUserInfo(user);
			setUserID(user.appUserId); // Set the username in the input field

			// Fetch images by userId
			const fetchImages = async (userId) => {
				try {
					const response = await axios.get(
						`http://localhost:5110/api/images/user/${userId}`
					);
					setImages(response.data); // Store the fetched images in state
				} catch (error) {
					console.error("An error occurred while fetching images", error);
				}
			};

			fetchImages(user.appUserId); // Pass userId to fetchImages
		}
	}, []);

	//Function to view image
	const imageClick = (image) => {
		if (image.imageID) {
			navigate(`/image/${image.imageID}`, {
				state: { image, fromMyLibrary: true },
			});
		}
	};

	// Calculate the indexes for the images to display on the current page
	const indexOfLastImage = currentPage * imagesPerPage;
	const indexOfFirstImage = indexOfLastImage - imagesPerPage;
	const currentImages = images.slice(indexOfFirstImage, indexOfLastImage); // Slice the images array to get images for the current page

	const totalPages = Math.ceil(currentImages.length / imagesPerPage);

	const getVisiblePages = (currentPage) => {
		const startPage = Math.max(1, currentPage - 1); // Display 3 pages at a time
		const endPage = Math.min(startPage + 2, totalPages);
		const pages = [];
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		return pages;
	};

	const visiblePages = getVisiblePages(currentPage);

	// Function to handle page change
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	// Function to go to the next page
	const nextPage = () => {
		if (currentPage < pageNumbers.length) {
			setCurrentPage(currentPage + 1);
		}
	};

	// Function to go to the previous page
	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>My Posts</title>
			</Head>
			<div className="container">
				<Navigation />
				<div className="mainPage">
					<div className="title">My Library</div>

					{/* return this if the user has not posted any images yet */}
					{images.length === 0 ? (
						<div className="message">
							<div className="noVideo">User has not posted images yet</div>
							<i className="bi bi-images"></i>
						</div>
					) : (
						<div className="imageContainer">
							{currentImages.map((image) => (
								<div className="imageCard" key={image.id}>
									<img
										src={image.imageURL}
										className="image"
										onClick={() => imageClick(image)}
									/>
									<div className="overlay">
										<h2>{image.title}</h2>
									</div>
									<i className="bi bi-chat-right"></i>
								</div>
							))}
						</div>
					)}
					<div className="pagination">
						<button
							onClick={prevPage}
							disabled={currentPage === 1}
							className="pageArrow"
						>
							<i className="bi bi-arrow-left-short"></i>
						</button>
						{visiblePages.map((number) => (
							<button
								key={number}
								onClick={() => paginate(number)}
								className={`$ pageNumber ${
									currentPage === number ? "activePage" : ""
								}`}
							>
								{number}
							</button>
						))}
						<button
							onClick={nextPage}
							disabled={currentPage === totalPages}
							className="pageArrow"
						>
							<i className="bi bi-arrow-right-short"></i>
						</button>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default MyLibrary;
