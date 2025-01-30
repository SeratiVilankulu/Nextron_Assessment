import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadPageStyle from "./UploadPage.module.css";
import PageStyle from "../Home/HomePage.module.css";
import { BsCloudUpload } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import SideNav from "../Navigations/SideNav";
import TopNav from "../Navigations/TopNav";

const UploadPage = () => {
	// State to manage form values
	const [formInput, setFormInput] = useState({
		Title: "",
		Category: "",
		Description: "",
		ImageURL: "",
	});

	const user = JSON.parse(localStorage.getItem("user"));

	const [errorMsg, setErrorMsg] = useState({}); // State to store error messages for form validation
	const [successMsg, setSuccessMsg] = useState(""); // State to display a success message after successful registration
	const [submitting, setSubmitting] = useState(false); // State to manage the form submission status (to prevent multiple submissions)
	const [file, setFile] = useState(null); // State to manage the selected file
	const [categories, setCategories] = useState([]); // State to manage the categories
	const [tags, setTags] = useState([]); // State to manage the tags

	// Fetch categories from the backend
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get("http://localhost:5085/api/category");
				// Store the entire category list including categoryID
				setCategories(response.data);
			} catch (error) {
				setErrorMsg("Cannot fetch categories");
			}
		};
		fetchCategories();
	}, []);

	// Function to handle changes in form input fields
	const handleImageInput = (name, value) => {
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

		// Validate image title
		if (!formInput.Title) {
			inputError.Title = "Image title cannot be empty";
		}

		// Validate image category
		if (!formInput.Category) {
			inputError.Category = "Category cannot be empty";
		}

		// Validate image description
		if (!formInput.Description) {
			inputError.Description = "Description cannot be empty";
		}

		//Check if Description is more than 50 characters
		if (formInput.Description.length > 50) {
			inputError.Description = "Description cannot be more than 50 characters";
		}

		// Validate file selection
		if (!file) {
			inputError.file = "Please select a file to upload.";
		} //Check if image is the correct type
		else if (!file.name.match(/\.(jpg|png|gif)$/)) {
			inputError.file =
				"Incorrect file type, please upload an image. File type: PNG or JPG.";
		} //Check image size, if it must not be greater than 5MB
		else if (file.size > 5000000) {
			inputError.file =
				"Image file is too large, image size must be less than 5MB ";
		}

		// If there are validation errors, set the error messages and return early
		if (Object.keys(inputError).length > 0) {
			setErrorMsg(inputError);
			return;
		}

		setSubmitting(true);
		handleSubmit();
	};

	// Function to handle file drop event
	const handleDrop = (event) => {
		event.preventDefault();
		const files = event.dataTransfer.files;
		if (files && files.length > 0) {
			setFile(files[0]);
		}
		console.log(files);
	};

	// Function to handle drag over event
	const handleDragOver = (event) => {
		event.preventDefault();
	};

	// Function to handle file input change event
	const handleFileChange = (event) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			setFile(files[0]);
		}
	};

	// Function to remove tags
	const removeTags = (indexToRemove) => {
		setTags(tags.filter((_, index) => index !== indexToRemove));
	};

	// Function to add tags
	const addTags = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const value = event.target.value.trim();
			if (!value) return;
			if (tags.length >= 5) {
				setErrorMsg({ tags: "You can only add up to 5 tags." });
				return;
			}
			if (value && !tags.includes(value)) {
				setTags([...tags, value]);
				event.target.value = "";
			}
		}
	};

	// Function to handle form submission
	const handleSubmit = async () => {
		console.log("Form input on submit:", formInput); // Log what is in the forInput fields

		const selectedCategory = categories.find(
			(category) => category.categoryID.toString() === formInput.Category
		);

		if (!selectedCategory) {
			setErrorMsg({ api: "Invalid category selected." });
			setSubmitting(false);
			return;
		}

		console.log("Selected category:", selectedCategory); // Log the selected category

		// object which holds all data from form
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", "sbivzvzz");
		formData.append("Title", formInput.Title);
		formData.append("Category", selectedCategory.categoryID); // Use selected categoryID
		formData.append("Description", formInput.Description);
		formData.append("ImageURL", formInput.ImageURL);
		formData.append("Tags", JSON.stringify(tags)); // Add tags to formData

		console.log(formInput);

		try {
			const response = await axios.post(
				"https://api.cloudinary.com/v1_1/dchdvpqew/image/upload", // URL to upload image to cloudinary
				formData
			);

			if (response.status === 200) {
				setSuccessMsg("File uploaded successfully.");
				setFile(null);
				setFormInput({
					Title: "",
					Category: "",
					Description: "",
					ImageURL: "",
				});
				setTags([]); // Clear the tags after form is submitted

				// Now post the image information to the database
				await handlePostToDB(
					{
						Title: formInput.Title,
						Category: selectedCategory.categoryID,
						Description: formInput.Description,
						ImageUrl: response.data.url,
						imageTags: tags,
					},
					selectedCategory.categoryID
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

	// Function to push image information to Database
	const handlePostToDB = async (imageData, categoryID) => {
		try {
			await axios.post(
				`http://localhost:5085/api/images/${categoryID}`,
				imageData,
				{
					headers: {
						Authorization: `Bearer ${user.verificationToken}`,
					},
				}
			);
			console.log("Image data being sent to DB:", imageData);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={PageStyle.container}>
			<SideNav />
			<div className={PageStyle.mainPage}>
				<TopNav />
				<div className={UploadPageStyle.uploadWrapper}>
					<h1 className={UploadPageStyle.heading}>Image Upload</h1>
					<form onSubmit={validateFormSubmit}>
						<div className={UploadPageStyle.inputBox}>
							<p className={UploadPageStyle.name}>Image Title</p>
							<input
								type="text"
								name="Title"
								className={UploadPageStyle.title}
								value={formInput.Title}
								onChange={(e) => handleImageInput("Title", e.target.value)}
							/>
							<p className={UploadPageStyle.errorMessage}>{errorMsg.Title}</p>
						</div>
						<div className={UploadPageStyle.inputBox}>
							<p className={UploadPageStyle.name}>Image Category</p>
							<select
								className={UploadPageStyle.category}
								value={formInput.Category}
								onChange={(e) => handleImageInput("Category", e.target.value)}
							>
								<option value="">Select a category</option>
								{categories.map((category) => (
									<option key={category.categoryID} value={category.categoryID}>
										{category.categoryType}
									</option>
								))}
							</select>
							<p className={UploadPageStyle.errorMessage}>
								{errorMsg.Category}
							</p>
						</div>
						<div className={UploadPageStyle.inputBox}>
							{" "}
							{/*Tags input box*/}
							<p className={UploadPageStyle.name}>Image tags</p>
							<div className={UploadPageStyle.tagsInput}>
								{tags.map((tag, index) => (
									<li key={index}>
										<span>{tag}</span>
										<i
											className={UploadPageStyle.close}
											onClick={() => removeTags(index)}
										>
											<IoIosCloseCircle />
										</i>
									</li>
								))}
								<input
									className={UploadPageStyle.tags}
									type="text"
									placeholder="Add a tag"
									onKeyDown={addTags}
								/>
								<p className={UploadPageStyle.errorMessage}>{errorMsg.tags}</p>
							</div>
						</div>
						<div className={UploadPageStyle.inputBox}>
							<p className={UploadPageStyle.name}>Image Description</p>
							<textarea
								type="text"
								name="Description"
								className={UploadPageStyle.description}
								value={formInput.Description}
								onChange={(e) =>
									handleImageInput("Description", e.target.value)
								}
							/>
							<p className={UploadPageStyle.errorMessage}>
								{errorMsg.Description}
							</p>
						</div>
						<div className={UploadPageStyle.inputBox}>
							<div
								className={UploadPageStyle.dragArea}
								onDrop={handleDrop}
								onDragOver={handleDragOver}
							>
								<BsCloudUpload className={UploadPageStyle.uploadIcon} />
								<p className={UploadPageStyle.drag}>Drag and Drop files here</p>
								<p className={UploadPageStyle.option}>or</p>
								<input
									type="file"
									name="ImageURL"
									className={UploadPageStyle.fileInput}
									id="file"
									accept="image/*"
									value={formInput.ImageURL}
									onChange={handleFileChange}
								/>
								<label
									htmlFor="file"
									className={UploadPageStyle.fileInputLabel}
								>
									Upload File
								</label>
							</div>
							{file && (
								<p className={UploadPageStyle.selectedFile}>
									Selected file: {file.name}
								</p> // Display the name of the selected file
							)}
							<p className={UploadPageStyle.errorMessage}>{errorMsg.file}</p>
							<p className={UploadPageStyle.errorMessage}>{errorMsg.api}</p>
						</div>
						<button
							type="submit"
							className={UploadPageStyle.submitBtn}
							disabled={submitting}
						>
							{submitting ? "Submitting..." : "Save"}
						</button>
						<p className={UploadPageStyle.successMessage}>{successMsg}</p>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UploadPage;
