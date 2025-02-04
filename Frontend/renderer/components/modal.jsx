import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ closeModal, videoId, defaultValue }) => {
	const [formError, setFormError] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [video, setVideo] = useState({
		title: "",
		description: "",
	});

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
		} else if (video.description.length > 50) {
			inputError.description = "Description cannot be more than 50 characters";
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
			const isSuccessful = await axios.put(
				`http://localhost:5110/api/video/${videoId}`,
				{
					title: video.title,
					description: video.description,
				}
			);

			if (isSuccessful) {
				// Close the modal
				closeModal();
			}
		} catch (error) {
			console.error("An error occurred while saving the image details", error);
			setFormError({
				apiError: "Failed to save image details. Please try again.",
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="modalContainer">
			<div className="modal">
				<form className="form" onSubmit={validateFormInput}>
					<h1 className="title">Image Details Update</h1>
					<button type="button" className="closeButton" onClick={closeModal}>
						<i className="bi bi-x"></i>
					</button>
					<div className="formGroup">
						<label>Image Title</label>
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
				</form>
			</div>
		</div>
	);
};

export default Modal;
