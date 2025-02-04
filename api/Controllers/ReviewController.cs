using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Review;
using api.Interfaces;
using api.Mappers;
using api.Models;
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
    public ReviewController(ApplicationDBContext context, IReviewRepository reviewRepo, IVideoRepository videoRepo)
    {
      _context = context;
      _reviewRepo = reviewRepo;
      _videoRepo = videoRepo;
    }

    //Get all reviews
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var reviews = await _reviewRepo.GetAllAsync();

      var reviewsDto = reviews.Select(r => r.ToReviewDto());

      return Ok(reviews);
    }

    //Get a review by its Id
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

    //Get a review by video Id
    [HttpGet("video/{videoId}")]
    public async Task<ActionResult<Review>> GetByVideoId(int videoId)
    {
      var reviews = await _reviewRepo.GetByVideoIdAsync(videoId);

      if (reviews == null || reviews.Count == 0)
      {
        return NotFound($"No reviews found for VideoId {videoId}");
      }

      return Ok(reviews);
    }


    //Posting A review
    [HttpPost("{videoId:int}")]
    public async Task<IActionResult> Create([FromRoute] int videoId, [FromBody] CreateReviewDto reviewDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      if (!await _videoRepo.VideoExists(videoId))
      {
        return BadRequest(" Video does not exist.");
      }

      var reviewModel = reviewDto.ToReviewFromCreate(videoId);
      reviewModel.CreatedAt = DateOnly.FromDateTime(DateTime.Now);

      await _reviewRepo.CreateAsync(reviewModel);

      return CreatedAtAction(nameof(GetById), new { reviewId = reviewModel.ReviewId }, reviewModel.ToReviewDto());
    }

    //Update a review
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

    //Delete a review
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