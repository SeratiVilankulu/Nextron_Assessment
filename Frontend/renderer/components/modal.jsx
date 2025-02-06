import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ closeModal, id, defaultValue }) => {
	const [formError, setFormError] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [video, setVideo] = useState({
		title: "",
		description: "",
	});
	const [updateSuccessMessage, setUpdateSuccessMessage] = useState(""); // Success message state

	useEffect(() => {
		if (defaultValue) {
			setVideo(defaultValue);
		}
	}, [defaultValue]);

	const handleVideoData = (name, value) => {
		setVideo({
			...video,
			[name]: value,
		});
	};

	const validateFormInput = async (event) => {
		event.preventDefault();
		setFormError({});

		let inputError = {};
		if (!video.title) {
			inputError.title = "Cannot submit without title";
		}
		if (!video.description) {
			inputError.description = "Cannot submit without description";
		} else if (video.description.length > 250) {
			inputError.description = "Description cannot be more than 250 characters";
		}

		if (Object.keys(inputError).length > 0) {
			setFormError(inputError);
			return;
		}

		setSubmitting(true);
		saveDetails();
	};

	const saveDetails = async () => {
		try {
			const response = await axios.patch(
				`http://localhost:5110/api/video/${id}`,
				{
					title: video.title,
					description: video.description,
				}
			);
			if (response.status === 200) {
				// Check if the response status indicates success
				setUpdateSuccessMessage("Video details updated successfully!");

				// Clear the success message after 3 seconds
				setTimeout(() => setUpdateSuccessMessage(""), 3000);

				// Close the modal after update
				closeModal();
			} else {
				throw new Error("Failed to update video details");
			}
		} catch (error) {
			console.error("An error occurred while saving the video details", error);
			setFormError({
				apiError: "Failed to save video details. Please try again.",
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="modalContainer">
			<div className="modal">
				<form className="form" onSubmit={validateFormInput}>
					<h1 className="title">Video Details Update</h1>
					<button type="button" className="closeModalButton" onClick={closeModal}>
						<i className="bi bi-x"></i>
					</button>
					<div className="formGroup">
						<label>Video Title</label>
						<input
							name="title"
							value={video.title}
							disabled={submitting}
							onChange={({ target }) =>
								handleVideoData(target.name, target.value)
							}
						/>
					</div>
					<p className="errorMessage">{formError.title}</p>
					<div className="formGroup">
						<label>Video Description</label>
						<textarea
							className="description"
							name="description"
							value={video.description}
							disabled={submitting}
							onChange={({ target }) =>
								handleVideoData(target.name, target.value)
							}
						/>
					</div>
					<p className="errorMessage">{formError.description}</p>
					<button type="submit" className="saveButton" disabled={submitting}>
						Save Details
					</button>

					{/* Success Message */}
					{updateSuccessMessage && (
						<div className="successMessage">
							<p>{updateSuccessMessage}</p>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default Modal;
