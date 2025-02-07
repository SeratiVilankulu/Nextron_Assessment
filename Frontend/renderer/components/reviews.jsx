import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { getLoggedInUser } from "../../main/authorization";

const Reviews = ({ videoId }) => {
	const [reviews, setReviews] = useState([]); // State for storing reviews
	const [newReview, setNewReview] = useState(""); // State for new review input
	const [rating, setRating] = useState(0); // State for rating input
	const [openReplies, setOpenReplies] = useState({}); // State to manage which reviews have replies visible
	const [replies, setReplies] = useState({}); // State to store replies for each review
	const [user, setUser] = useState(null); // State to store logged-in user
	const [newReply, setNewReply] = useState({}); // State to store replies for each review
	const [loadingReviews, setLoadingReviews] = useState(false); // Loading state for reviews
	const [loadingReplies, setLoadingReplies] = useState({}); // Loading state for replies

	// State for managing the editing review and reply IDs
	const [editingReviewId, setEditingReviewId] = useState(null);
	const [editingReplyId, setEditingReplyId] = useState(null);
	const [editedReviewText, setEditedReviewText] = useState("");
	const [editedReplyText, setEditedReplyText] = useState("");

	// Fetch user data and check if logged in
	useEffect(() => {
		const loggedInUser = getLoggedInUser();
		if (loggedInUser) {
			setUser(loggedInUser);
		} else {
			window.location.href = "/home"; // Redirect to home if no user
		}
	}, []);

	// Fetch reviews whenever the videoId changes
	useEffect(() => {
		if (videoId) {
			fetchReviews();
		}
	}, [videoId]);

	// Fetch reviews from the backend for the current video
	const fetchReviews = async () => {
		setLoadingReviews(true);
		try {
			const response = await axios.get(
				`http://localhost:5110/api/review/video/${videoId}`
			);
			setReviews(response.data);
		} catch (error) {
			console.error("Error fetching reviews:", error);
		} finally {
			setLoadingReviews(false);
		}
	};

	// Fetch replies for a specific review from the backend
	const fetchReplies = async (reviewId) => {
		setLoadingReplies((prev) => ({ ...prev, [reviewId]: true }));
		try {
			const response = await axios.get(
				`http://localhost:5110/api/reply/review/${reviewId}`
			);
			setReplies((prevReplies) => ({
				...prevReplies,
				[reviewId]: response.data,
			}));
		} catch (error) {
			console.error("Error fetching replies:", error);
		} finally {
			setLoadingReplies((prev) => ({ ...prev, [reviewId]: false }));
		}
	};

	// Toggle replies visibility and fetch them if not already fetched
	const handleToggleReplies = (reviewId) => {
		setOpenReplies((prevOpenReplies) => ({
			...prevOpenReplies,
			[reviewId]: !prevOpenReplies[reviewId],
		}));

		// Fetch replies only if not already fetched
		if (!replies[reviewId]) {
			fetchReplies(reviewId);
		}
	};

	// Handle adding a new review
	const handleAddReview = async () => {
		if (!newReview.trim()) return;
		try {
			await axios.post(
				`http://localhost:5110/api/review/${videoId}`,
				{
					reviewText: newReview,
					rating: rating,
				},
				{
					headers: { Authorization: `Bearer ${user.verificationToken}` },
				}
			);
			setNewReview(""); // Clear the input after posting
			setRating(0); // Reset the rating
			fetchReviews(); // Reload the reviews
		} catch (error) {
			console.error("Error adding review:", error);
		}
	};

	// Handle adding a new reply
	const handleAddReply = async (reviewId) => {
		if (!newReply[reviewId]?.trim()) return;
		try {
			await axios.post(
				`http://localhost:5110/api/reply/${reviewId}`,
				{ replyText: newReply[reviewId] },
				{ headers: { Authorization: `Bearer ${user.verificationToken}` } }
			);
			setNewReply((prev) => ({ ...prev, [reviewId]: "" })); // Clear reply input
			fetchReplies(reviewId); // Reload replies
		} catch (error) {
			console.error("Error adding reply:", error);
		}
	};

	// Handle deleting a review
	const handleDeleteReview = async (reviewId) => {
		try {
			await axios.delete(`http://localhost:5110/api/review/${reviewId}`, {
				headers: { Authorization: `Bearer ${user.verificationToken}` },
			});
			fetchReviews(); // Reload reviews after deletion
		} catch (error) {
			console.error("Error deleting review:", error);
		}
	};

	// Handle deleting a reply
	const handleDeleteReply = async (reviewId, replyId) => {
		try {
			await axios.delete(`http://localhost:5110/api/reply/${replyId}`, {
				headers: { Authorization: `Bearer ${user.verificationToken}` },
			});
			fetchReplies(reviewId); // Reload replies after deletion
		} catch (error) {
			console.error("Error deleting reply:", error);
		}
	};

	// Handle updating a review
	const handleUpdateReview = async (reviewId) => {
		if (!editedReviewText.trim()) return; // Prevent empty submissions
		try {
			await axios.patch(
				`http://localhost:5110/api/review/${reviewId}`,
				{
					reviewText: editedReviewText, // Updated review text
					rating: rating, // Ensure you are updating the rating as well
				},
				{
					headers: { Authorization: `Bearer ${user.verificationToken}` },
				}
			);
			setEditingReviewId(null); // Reset editing state
			fetchReviews(); // Reload the reviews after updating
		} catch (error) {
			console.error("Error updating review:", error);
		}
	};

	// Handle updating a reply
	const handleUpdateReply = async (replyId) => {
		if (!editedReplyText.trim()) return; // Prevent empty submissions
		try {
			await axios.patch(
				`http://localhost:5110/api/reply/${replyId}`,
				{ replyText: editedReplyText },
				{ headers: { Authorization: `Bearer ${user.verificationToken}` } }
			);
			setEditingReplyId(null); // Reset editing state
			fetchReplies(replyId); // Reload replies after updating
		} catch (error) {
			console.error("Error updating reply:", error);
		}
	};

	return (
		<div className="reviewsContainer">
			<h3>Comments</h3>

			{/* Input section for adding a new review */}
			<div className="addReview">
				<textarea
					value={newReview}
					onChange={(e) => setNewReview(e.target.value)}
					placeholder="Add a review..."
				/>
				{/* Rating stars for the review */}
				<div className="rating">
					{[1, 2, 3, 4, 5].map((star) => (
						<span
							key={star}
							className={`star ${star <= rating ? "filled" : ""}`}
							onClick={() => setRating(star)}
						>
							<i className="bi bi-star"></i>
						</span>
					))}
				</div>
				<button className="postReview" onClick={handleAddReview}>
					Post
				</button>
			</div>

			{/* List of reviews */}
			{loadingReviews ? (
				<p>Loading reviews...</p>
			) : reviews.length ? (
				<ul className="reviewList">
					{reviews.map((review) => (
						<li key={review.reviewId} className="reviewItem">
							<div className="userRating">
								<div className="rate">
									<p>{review.rating}</p>
									<i className="bi bi-star-fill"></i>
								</div>
								<div className="iconsContainer">
									{/* Edit icon */}
									<i
										className="bi bi-pencil-fill"
										onClick={() => {
											setEditingReviewId(review.reviewId);
											setEditedReviewText(review.reviewText);
											setRating(review.rating); // Set the rating during editing
										}}
									></i>
									{/* Delete icon */}
									<i
										className="bi bi-trash3"
										onClick={() => handleDeleteReview(review.reviewId)}
									></i>
								</div>
							</div>
							<div className="reviewContent">
								{/* Display either the review text or the input field when editing */}
								{editingReviewId === review.reviewId ? (
									<>
										<textarea
											value={editedReviewText}
											onChange={(e) => setEditedReviewText(e.target.value)}
										/>
										<div className="editIcons">
											<button
												className="savesButton"
												onClick={() => handleUpdateReview(review.reviewId)}
											>
												<i className="bi bi-check save"></i>
											</button>
											<button
												className="cancel"
												onClick={() => setEditingReviewId(null)}
											>
												<i className="bi bi-x cancel"></i>
											</button>
										</div>
									</>
								) : (
									<>
										<p className="reviewText">{review.reviewText}</p>
										<small className="reviewDate">
											By {review.creatorUserName}{" "}
											{formatDistanceToNow(new Date(review.createdAt))} ago
										</small>
									</>
								)}
							</div>

							{/* Replies section */}
							<p
								className="viewReplies"
								onClick={() => handleToggleReplies(review.reviewId)}
							>
								{openReplies[review.reviewId]
									? "Hide replies"
									: "See all replies"}
							</p>

							{/* Display replies if they are visible */}
							{openReplies[review.reviewId] && (
								<>
									{/* If replies are loading, show loading text */}
									{loadingReplies[review.reviewId] ? (
										<p>Loading replies...</p>
									) : (
										<>
											{/* Display the replies */}
											<ul className="repliesList">
												{replies[review.reviewId]?.map((reply) => (
													<li key={reply.replyId}>
														<div className="replyContent">
															{/* Display either the reply text or the input field when editing */}
															{editingReplyId === reply.replyId ? (
																<>
																	<textarea
																		value={editedReplyText}
																		onChange={(e) =>
																			setEditedReplyText(e.target.value)
																		}
																	/>
																	<div className="editIcons">
																		<button
																			className="savesButton"
																			onClick={() =>
																				handleUpdateReply(reply.replyId)
																			}
																		>
																			<i className="bi bi-check save"></i>
																		</button>
																		<button
																			className="cancel"
																			onClick={() => setEditingReplyId(null)}
																		>
																			<i className="bi bi-x cancel"></i>
																		</button>
																	</div>
																</>
															) : (
																<>
																	<p className="replyText">{reply.replyText}</p>
																	<small className="replyDate">
																		By {reply.creatorUserName}{" "}
																		{formatDistanceToNow(
																			new Date(reply.createdAt)
																		)}{" "}
																		ago
																	</small>
																</>
															)}
														</div>

														{/* Edit and Delete options for replies */}
														<div className="iconsContainer">
															{/* Edit icon */}
															<i
																className="bi bi-pencil-fill"
																onClick={() => {
																	setEditingReplyId(reply.replyId);
																	setEditedReplyText(reply.replyText);
																}}
															></i>
															{/* Delete icon */}
															<i
																className="bi bi-trash3"
																onClick={() =>
																	handleDeleteReply(
																		review.reviewId,
																		reply.replyId
																	)
																}
															></i>
														</div>
													</li>
												))}
											</ul>
										</>
									)}
									{/* Add new reply section */}
									<div className="replySection">
										<textarea
											value={newReply[review.reviewId] || ""}
											onChange={(e) =>
												setNewReply((prev) => ({
													...prev,
													[review.reviewId]: e.target.value,
												}))
											}
											placeholder="Add a reply..."
										/>
										<button onClick={() => handleAddReply(review.reviewId)}>
											Reply
										</button>
									</div>
								</>
							)}
						</li>
					))}
				</ul>
			) : (
				<p>No reviews yet, be the first one!</p>
			)}
		</div>
	);
};

export default Reviews;