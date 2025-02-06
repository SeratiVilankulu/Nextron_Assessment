using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Review;
using api.Extensions;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
  [Route("api/review")]
  [ApiController]
  public class ReviewController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly IReviewRepository _reviewRepo;
    private readonly IVideoRepository _videoRepo;
    private readonly UserManager<AppUser> _userManager;
    public ReviewController(ApplicationDBContext context, IReviewRepository reviewRepo, IVideoRepository videoRepo,
    UserManager<AppUser> userManager)
    {
      _context = context;
      _reviewRepo = reviewRepo;
      _videoRepo = videoRepo;
      _userManager = userManager;
    }

    // Get endpoint fetch all reviews
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var reviews = await _reviewRepo.GetAllAsync();

      var reviewsDto = reviews.Select(r => new ReviewDto
      {
        Rating = r.Rating,
        ReviewText = r.ReviewText,
        CreatedAt = r.CreatedAt,
        CreatorUserName = r.AppUser != null ? r.AppUser.UserName : "Unknown"
      }).ToList();

      return Ok(reviewsDto);
    }

    // Get endpoint to fetch a review by its Id
    [HttpGet("{reviewId:int}")]
    public async Task<IActionResult> GetById([FromRoute] int reviewId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var review = await _reviewRepo.GetByIdAsync(reviewId);

      if (review == null)
      {
        return NotFound();
      }

      return Ok(review.ToReviewDto());
    }

    // Get endpoint to fetch a review by video Id
    [HttpGet("video/{videoId}")]
    public async Task<ActionResult<List<ReviewDto>>> GetByVideoId(int videoId)
    {
      var reviews = await _reviewRepo.GetByVideoIdAsync(videoId);

      if (reviews == null || reviews.Count == 0)
      {
        return NotFound($"No reviews found for VideoId {videoId}");
      }

      // Map reviews to ReviewDto and include CreatorUserName
      var reviewsDto = reviews.Select(r => new ReviewDto
      {
        ReviewId = r.ReviewId,
        ReviewText = r.ReviewText,
        Rating = r.Rating,
        CreatedAt = r.CreatedAt,
        // AppUser = r.AppUserId,
        CreatorUserName = r.AppUser != null ? r.AppUser.UserName : "Unknown" // Add the user's username
      }).ToList();

      return Ok(reviewsDto);
    }



    //Post endpoint to post a review
    [HttpPost("{videoId:int}")]
    public async Task<IActionResult> Create([FromRoute] int videoId, [FromBody] CreateReviewDto reviewDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      if (!await _videoRepo.VideoExists(videoId))
      {
        return BadRequest(" Video does not exist.");
      }

      var userEmail = User.GetUserEmail(); // from the claims extension
      
      if (string.IsNullOrEmpty(userEmail))
      {
        return Unauthorized("Email is missing from the claims.");
      }

      var user = await _userManager.FindByEmailAsync(userEmail);
      if (user == null)
      {
        return Unauthorized("User not found.");
      }

      var userId = user.Id;

      var reviewModel = reviewDto.ToReviewFromCreate(videoId);
      reviewModel.AppUserId = userId; // Set the userId here
      reviewModel.VideoId = videoId; // Ensure videoId is set
      reviewModel.CreatedAt = DateOnly.FromDateTime(DateTime.Now);

      await _reviewRepo.CreateAsync(reviewModel);

      return CreatedAtAction(nameof(GetById), new { reviewId = reviewModel.ReviewId }, reviewModel.ToReviewDto());
    }

    //Update endpoint to update a review
    [HttpPatch]
    [Route("{reviewId:int}")]
    public async Task<IActionResult> Update([FromRoute] int reviewId, [FromBody] UpdateReviewRequestDto updateDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var review = await _reviewRepo.UpdateAsync(reviewId, updateDto.ToReviewFromUpdate());

      if (review == null)
      {
        return NotFound("Review unavailable");
      }

      return Ok(review.ToReviewDto());
    }

    //Delete endpoint to delete a review
    [HttpDelete]
    [Route("{reviewId:int}")]
    public async Task<IActionResult> Delete([FromRoute] int reviewId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var reviewModel = await _reviewRepo.DeleteAsync(reviewId);

      if (reviewModel == null)
      {
        return NotFound("Review does not exist");
      }

      return Ok(reviewModel);
    }
  }
}