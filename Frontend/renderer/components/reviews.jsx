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
	const [user, setUser] = useState(null); // State to store logged in user
	const [newReply, setNewReply] = useState({}); // State to store replies for each review
	const [loadingReviews, setLoadingReviews] = useState(false); // Loading state for reviews
	const [loadingReplies, setLoadingReplies] = useState({}); // Loading state for replies

	// Fetch user data and check if logged in
	useEffect(() => {
		const loggedInUser = getLoggedInUser();
		if (loggedInUser) {
			setUser(loggedInUser);
		} else {
			window.location.href = "/login"; // Redirect to login if no user
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
								<p>{review.rating}</p>
								<i className="bi bi-star-fill"></i>
							</div>
							<div className="reviewContent">
								<p className="reviewText">{review.reviewText}</p>
								<small className="reviewDate">
									By {review.creatorUserName}{" "}
									{formatDistanceToNow(new Date(review.createdAt))} ago
								</small>
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
							{openReplies[review.reviewId] &&
							loadingReplies[review.reviewId] ? (
								<p>Loading replies...</p>
							) : (
								replies[review.reviewId] && (
									<ul className="repliesList">
										{replies[review.reviewId].map((reply) => (
											<li key={reply.replyId}>
												<p className="replyText">{reply.replyText}</p>
												<small>
													By {reply.creatorUserName},{" "}
													{formatDistanceToNow(new Date(reply.createdAt))} ago
												</small>
											</li>
										))}
									</ul>
								)
							)}

							{/* Reply section */}
							{openReplies[review.reviewId] && (
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
							)}
						</li>
					))}
				</ul>
			) : (
				<p>No reviews yet. Be the first to add one!</p>
			)}
		</div>
	);
};

export default Reviews;
