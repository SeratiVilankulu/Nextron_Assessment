import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import Navigation from "../components/navigation";

const UploadPage = () => {
	// State to manage form values
	const [formInput, setFormInput] = useState({
		Title: "",
		Category: "",
		Description: "",
    ThumbnailURL: "",
		VideoURL: "",
	});

	useEffect(() => {
		// Access localStorage only on the client side
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

	const [errorMsg, setErrorMsg] = useState({}); // State to store error messages for form validation
	const [successMsg, setSuccessMsg] = useState(""); // State to display a success message after successful registration
	const [submitting, setSubmitting] = useState(false); // State to manage the form submission status (to prevent multiple submissions)
	const [imageFile, setImageFile] = useState(null);
	const [videoFile, setVideoFile] = useState(null);
	const [categories, setCategories] = useState([]); // State to manage the categories

	// Fetch categories from the backend
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get("http://localhost:5110/api/category");
				// Store the entire category list including categoryId
				setCategories(response.data);
			} catch (error) {
				setErrorMsg({ api: "Cannot fetch categories" });
			}
		};
		fetchCategories();
	}, []);

	// Function to handle changes in form input fields
	const handleVideoInput = (name, value) => {
		setFormInput({
			...formInput,
			[name]: value,
		});
	};

	// Function to handle form submission and validate input
	const validateFormSubmit = async (event) => {
		event.preventDefault();
		setErrorMsg({});
		setSuccessMsg("");

		let inputError = {};

		// Validate title
		if (!formInput.Title) {
			inputError.Title = "Title cannot be empty";
		}

		// Validate category
		if (!formInput.Category) {
			inputError.Category = "Category cannot be empty";
		}

		// Validate description
		if (!formInput.Description) {
			inputError.Description = "Description cannot be empty";
		}

		//Check if Description is more than 250 characters
		if (formInput.Description.length > 250) {
			inputError.Description = "Description cannot be more than 250 characters";
		}

		// Validate file selection
		if (!imageFile || !videoFile) {
			inputError.file = "Please select a file to upload.";
		} else {
			// If it's an Thumbnail file
			if (imageFile && imageFile.type.startsWith("image/")) {
				// Check if image is the correct type
				if (!imageFile.name.match(/\.(jpg|png|gif)$/)) {
					inputError.file =
						"Incorrect file type, please upload an image. File type: PNG, JPG, or GIF.";
				}
				// Check if Thumbnail size is greater than 5MB
				else if (imageFile.size > 500000000) {
					inputError.file =
						"Image file is too large. Image size must be less than 5MB.";
				}
			}

			// If it's a video file
			else if (videoFile && videoFile.type.startsWith("video/")) {
				// Check if video is the correct type (MP4, MOV, etc.)
				if (!videoFile.name.match(/\.(mp4|mov|avi)$/)) {
					inputError.file =
						"Incorrect file type, please upload a video. File type: MP4, MOV, or AVI.";
				}
				// Check if video size is greater than 50MB (for example)
				else if (videoFile.size > 500000000) {
					inputError.file =
						"Video file is too large. Video size must be less than 50MB.";
				}
			}
		}

		// If there are validation errors, set the error messages and return early
		if (Object.keys(inputError).length > 0) {
			setErrorMsg(inputError);
			return;
		}

		setSubmitting(true);
		handleSubmit();
	};

	const handleDrop = (event, type) => {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files && files.length > 0) {
			const file = files[0];

			// Check the file type and set the appropriate state
			if (type === "image" && file.type.startsWith("image/")) {
				setImageFile(file);
			} else if (type === "video" && file.type.startsWith("video/")) {
				setVideoFile(file);
			}
		}
	};

	// Function to handle drag over event
	const handleDragOver = (event) => {
		event.preventDefault();
	};

	// Function to handle file input change event
	const handleFileChange = (e, type) => {
		const file = e.target.files[0];
		if (file) {
			if (type === "image") {
				setImageFile(file);
			} else if (type === "video") {
				setVideoFile(file);
			}
		}
	};

	// Function to handle form submission
	const handleSubmit = async () => {
		const selectedCategory = categories.find(
			(category) => category.categoryId.toString() === formInput.Category
		);

		if (!selectedCategory) {
			setErrorMsg({ api: "Invalid category selected." });
			setSubmitting(false);
			return;
		}

		console.log("Selected category:", selectedCategory); // Log the selected category

		// object which holds all data from form
		const formData = new FormData();
		formData.append("upload_preset", "gfswaht");
		formData.append("Title", formInput.Title);
		formData.append("Category", selectedCategory.categoryId); // Use selected categoryId
		formData.append("Description", formInput.Description);
		formData.append("Thumbnail", imageFile);
		formData.append("file", videoFile);

		try {
			const videoResponse = await axios.post(
				"https://api.cloudinary.com/v1_1/dchdvpqew/video/upload",
				// URL to upload thumbnail and video to cloudinary
				formData
			);

       const imageFormData = new FormData();
				imageFormData.append("upload_preset", "gfswaht");
				imageFormData.append("file", imageFile); // Only upload image

				const imageResponse = await axios.post(
					"https://api.cloudinary.com/v1_1/dchdvpqew/image/upload",
					imageFormData
				);


			if (videoResponse.status === 200 && imageResponse.status === 200) {
				setSuccessMsg("File uploaded successfully.");
				setImageFile(null);
				setVideoFile(null);
				setFormInput({
					Title: "",
					Category: "",
					Description: "",
					ThumbnailURL: "",
					VideoURL: "",
				});

				// Post the video information to the database
				await handlePostToDB(
					{
						Title: formInput.Title,
						Category: selectedCategory.categoryId,
						Description: formInput.Description,
						ThumbnailURL: imageResponse.data.url,
						VideoURL: videoResponse.data.url,
					},
					selectedCategory.categoryId
				); // Make selectedCategory accessible in handlePostToDB function, since it's defined outside its scope
			} else {
				setErrorMsg({ api: "Failed to upload file" });
			}
		} catch (error) {
			console.error(error);
			setErrorMsg({ api: "An error occurred while uploading the file." });
		} finally {
			setSubmitting(false);
		}
	};

	// Function to push video information to Database
	const handlePostToDB = async (videoData, categoryId) => {
		try {
			await axios.post(
				`http://localhost:5110/api/video/${categoryId}`,
				videoData,
				// {
				// 	headers: {
				// 		Authorization: `Bearer ${user.verificationToken}`,
				// 	},
				// }
			);
			console.log("Details sent to DB:", videoData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Streamify Upload</title>
			</Head>
			<div className="container">
				<div className="mainPage">
					<Navigation />
					<div className="uploadWrapper">
						<h1 className="uploadHeading">Video Upload</h1>
						<form onSubmit={validateFormSubmit}>
							<div className="inputContainer">
								<div className="uploadInputBox">
									<p className="uploadName">Title</p>
									<input
										type="text"
										name="Title"
										className="uploadTitle"
										value={formInput.Title}
										onChange={(e) => handleVideoInput("Title", e.target.value)}
									/>
									<p className="errorMessage">{errorMsg.Title}</p>
								</div>
								<div className="uploadInputBox">
									<p className="uploadName">Category</p>
									<select
										className="category"
										value={formInput.Category}
										onChange={(e) =>
											handleVideoInput("Category", e.target.value)
										}
									>
										<option value="">Select a category</option>
										{categories.map((category) => (
											<option
												key={category.categoryId}
												value={category.categoryId}
											>
												{category.categoryName}
											</option>
										))}
									</select>
									<p className="errorMessage">{errorMsg.Category}</p>
								</div>
							</div>

							<div className="uploadInputBox">
								<p className="uploadName">Description</p>
								<textarea
									type="text"
									name="Description"
									className="description"
									value={formInput.Description}
									onChange={(e) =>
										handleVideoInput("Description", e.target.value)
									}
								/>
								<p className="errorMessage">{errorMsg.Description}</p>
							</div>
							<div className="inputContainer">
								<div className="uploadInputBox">
									<div
										className="dragArea"
										onDrop={(e) => handleDrop(e, "image")}
										onDragOver={handleDragOver}
									>
										<i className="bi bi-image uploadIcon"></i>
										<p className="uploadDrag">
											Drag and Drop <span>Image</span> here
										</p>
										<p className="uploadOption">or</p>
										<input
											type="file"
											name="ThumbnailURL"
											className="fileInput"
											id="imageFile"
											accept="image/*"
											value={formInput.ThumbnailURL}
											onChange={handleFileChange}
										/>
										<label htmlFor="file" className="fileLabel">
											Upload File
										</label>
									</div>
									{imageFile && (
										<p className="selectedFile">
											Selected file: {imageFile.name}
										</p>
									)}
									<p className="errorMessage">{errorMsg.file}</p>
									<p className="errorMessage">{errorMsg.api}</p>
								</div>
								<div className="uploadInputBox">
									<div
										className="dragArea"
										onDrop={(e) => handleDrop(e, "video")}
										onDragOver={handleDragOver}
									>
										<i className="bi bi-camera-video uploadIcon"></i>
										<p className="uploadDrag">
											Drag and Drop <span>Video</span> here
										</p>
										<p className="uploadOption">or</p>
										<input
											type="file"
											name="VideoURL"
											className="fileInput"
											id="videoFile"
											accept="video/*"
											value={formInput.VideoURL}
											onChange={handleFileChange}
										/>
										<label htmlFor="file" className="fileLabel">
											Upload File
										</label>
									</div>
									{videoFile && (
										<p className="selectedFile">
											Selected file: {videoFile.name}
										</p>
									)}
									<p className="errorMessage">{errorMsg.file}</p>
									<p className="errorMessage">{errorMsg.api}</p>
								</div>
							</div>

							<div className="btn">
								<button
									type="submit"
									className="submitBtn"
									disabled={submitting}
								>
									{submitting ? "Submitting..." : "Upload"}
								</button>
							</div>
							<p className="successMessage">{successMsg}</p>
						</form>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default UploadPage;
