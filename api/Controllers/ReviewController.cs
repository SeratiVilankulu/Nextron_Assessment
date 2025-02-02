using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Review;
using api.Interfaces;
using api.Mappers;
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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var reviews = await _reviewRepo.GetAllAsync();

      var reviewsDto = reviews.Select(r => r.ToReviewDto());

      return Ok(reviews);
    }

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