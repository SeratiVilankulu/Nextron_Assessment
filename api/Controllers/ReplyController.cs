using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Reply;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [Route("api/reply")]
  [ApiController]
  public class ReplyController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly IReplyRepository _replyRepo;
    private readonly IReviewRepository _reviewRepo;
    public ReplyController(ApplicationDBContext context, IReplyRepository replyRepo, IReviewRepository reviewRepo)
    {
      _context = context;
      _replyRepo = replyRepo;
      _reviewRepo = reviewRepo;
    }

    // Get endpoint to fetch all replies
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var replies = await _replyRepo.GetAllAsync();

      var repliesDto = replies.Select(r => new ReplyDto
      {
        ReplyText = r.ReplyText,
        CreatedAt = r.CreatedAt,
        CreatorUserName = r.AppUser != null ? r.AppUser.UserName : "Unknown"
      }).ToList();

      return Ok(repliesDto);
    }

    // Get endpoint to fetch a reply by its Id
    [HttpGet("{replyId:int}")]
    public async Task<IActionResult> GetById([FromRoute] int replyId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var reply = await _replyRepo.GetByIdAsync(replyId);

      if (reply == null)
      {
        return NotFound();
      }

      return Ok(reply.ToReplyDto());
    }

    //Get endpoint to fetch a reply by review Id
    [HttpGet("review/{reviewId:int}")]
    public async Task<ActionResult<List<ReplyDto>>> GetByReviewId(int reviewId)
    {
      // Retrieve replies along with the related AppUser
      var replies = await _replyRepo.GetByReviewIdAsync(reviewId);

      if (replies == null || replies.Count == 0)
      {
        return NotFound($"No replies found for ReviewId {reviewId}");
      }

      // Map replies to ReplyDto, including the user name
      var repliesDto = replies.Select(r => new ReplyDto
      {
        ReplyId = r.ReplyId,
        ReplyText = r.ReplyText,
        CreatedAt = r.CreatedAt,
        CreatorUserName = r.AppUser != null ? r.AppUser.UserName : "Unknown" // Add creator username
      }).ToList();

      return Ok(repliesDto);
    }


    //Post endpoint to post a reply under a review
    [HttpPost("{reviewId:int}")]
    public async Task<IActionResult> Create([FromRoute] int reviewId, [FromBody] CreateReplyDto replyDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      Console.WriteLine($"Received reviewId: {reviewId}");

      if (!await _reviewRepo.ReviewExists(reviewId))
      {
        return BadRequest(" Reply does not exist.");
      }

      var replyModel = replyDto.ToReplyFromCreate(reviewId);
      replyModel.CreatedAt = DateOnly.FromDateTime(DateTime.Now);

      await _replyRepo.CreateAsync(replyModel);

      Console.WriteLine($"Created reply with ID: {replyModel.ReplyId}");

      return CreatedAtAction(nameof(GetById), new { replyId = replyModel.ReplyId }, replyModel.ToReplyDto());
    }

    //Update endpoint to update a reply details
    [HttpPatch]
    [Route("{replyId:int}")]
    public async Task<IActionResult> Update([FromRoute] int replyId, [FromBody] UpdateReplyRequestDto updateDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var existingReply = await _replyRepo.GetByIdAsync(replyId);

      if (existingReply == null)
      {
        return NotFound("Reply not found");
      }

      // Update the fields from DTO
      existingReply.ReplyText = updateDto.ReplyText;
      existingReply.UpdatedAt = DateOnly.FromDateTime(DateTime.Now);
      var reply = await _replyRepo.UpdateAsync(replyId, updateDto.ToReplyFromUpdate());

      if (reply == null)
      {
        return NotFound("Reply not found");
      }

      return Ok(reply.ToReplyDto());
    }

    //Delete endpoint to delete a reply
    [HttpDelete]
    [Route("{replyId:int}")]
    public async Task<IActionResult> Delete([FromRoute] int replyId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var replyModel = await _replyRepo.DeleteAsync(replyId);

      if (replyModel == null)
      {
        return NotFound("Reply does not exist");
      }

      return Ok(replyModel);
    }
  }
}