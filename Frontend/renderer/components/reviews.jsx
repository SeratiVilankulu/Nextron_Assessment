import React, { useState, useEffect } from "react";
import axios from "axios";

const Reviews = ({ videoId }) => {
	const [reviews, setReviews] = useState([]);
	const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
	const [reply, setReply] = useState([]);
  const [newReply, setNewReply] = useState("");

	useEffect(() => {
		if (videoId) {
			fetchReviews();
      fetchReplies();
		}
	}, [videoId]);

	// Function to fetch reviews from the backend
	const fetchReviews = async () => {
		try {
			const response = await axios.get(`http://localhost:5110/api/review/video/${videoId}`);
			setReviews(response.data);
		} catch (error) {
			console.error("Error fetching review:", error);
		}
	};

	// Function to fetch replies to reviews from the backend
	const fetchReplies = async () => {
		try {
			const response = await axios.get(`http://localhost:5110/api/reply/`);
			setNewReply(response.data);
		} catch (error) {
			console.error("Error fetching reply:", error);
		}
	};

	// Function for posting a new reviews
	const handleAddReview = async () => {
		if (!newReview.trim()) return;
		try {
			await axios.post(`http://localhost:5110/api/review/${videoId}`, {
				reviewText: newReview,
        rating: rating,
			});
			setNewReview("");
      setRating(0);
			fetchReviews(); // Reload reviews
		} catch (error) {
			console.error("Error adding review:", error);
		}
	};

	return (
		<div className="reviewsContainer">
			<h3>Comments</h3>

			{/* Review Input */}
			<div className="addReview">
				<textarea
					value={newReview}
					onChange={(e) => setNewReview(e.target.value)}
					placeholder="Add a review..."
				/>
				{/* Video Rating  */}
				<div className="rating">
					{[1, 2, 3, 4, 5].map((star) => (
						<span
							key={star}
							className={`star ${star <= rating ? "filled" : ""}`}
							onClick={() => setRating(star)}
						>
							<i class="bi bi-star"></i>
						</span>
					))}
				</div>
				<button className="postReview" onClick={handleAddReview}>
					Post
				</button>
			</div>

			{/* Review List */}
			<ul className="reviewList">
				{reviews.length ? (
					reviews.map((review) => (
						<li key={review.reviewId}>
							<p>{review.reviewText}</p>
							<small>
								By {review.author} at{" "}
								{new Date(review.createdAt).toLocaleString()}
							</small>
							<div className="userRating">
								<p> {review.rating}</p>
								<i class="bi bi-star-fill"></i>
							</div>
              <p className="viewReplies">see all replies</p>
						</li>
					))
				) : (
					<p>No reviews yet. Be the first to add one!</p>
				)}
			</ul>
		</div>
	);
};

export default Reviews;
