using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Video;
using api.Interfaces;
using api.Mappers;
using api.Models;
using MediaToolkit;
using api.Extensions;
using MediaToolkit.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
  [Route("api/video")]
  [ApiController]
  public class VideoController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly IVideoRepository _videoRepo;
    private readonly UserManager<AppUser> _userManager;

    public VideoController(ApplicationDBContext context, IVideoRepository videoRepo, UserManager<AppUser> userManager)
    {
      _videoRepo = videoRepo;
      _context = context;
      _userManager = userManager;
    }

    // Get endpoint to fetch all videos
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var videos = await _videoRepo.GetAllAsync();

      var videosDto = videos.Select(v => new VideoDto
      {
        VideoId = v.VideoId,
        Title = v.Title,
        Description = v.Description,
        ThumbnailURL = v.ThumbnailURL,
        VideoURL = v.VideoURL,
        IsPublic = v.IsPublic,
        CreatedAt = v.CreatedAt,
        Reviews = v.Reviews.Select(r => r.ToReviewDto()).ToList(),
        CreatorUserName = v.AppUser != null ? v.AppUser.UserName : "Unknown"
      }).ToList();

      return Ok(videosDto);
    }

    // Get endpoint to fetch a video by its Id
    [HttpGet("{videoId:int}")]
    public async Task<IActionResult> GetById([FromRoute] int videoId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      // Get the video along with user details
      var video = await _videoRepo.GetByIdAsync(videoId);

      if (video == null)
      {
        return NotFound();
      }

      // Map to DTO and include the CreatorUserName
      var videoDto = new VideoDto
      {
        VideoId = video.VideoId,
        Title = video.Title,
        Description = video.Description,
        ThumbnailURL = video.ThumbnailURL,
        VideoURL = video.VideoURL,
        IsPublic = video.IsPublic,
        CreatedAt = video.CreatedAt,
        Reviews = video.Reviews.Select(r => r.ToReviewDto()).ToList(),
        CreatorUserName = video.AppUser != null ? video.AppUser.UserName : "Unknown",
        CreatorUserId = video.AppUser?.Id
      };

      return Ok(videoDto);
    }


    // Get endpoint to fetch a video by user Id
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
      var videos = await _videoRepo.GetByUserIdAsync(userId);
      if (videos == null || !videos.Any())
      {
        return NotFound($"No videos found for the user {userId}.");
      }
      return Ok(videos);
    }

    //Post endpoint to post a video in a particular category
    [HttpPost("{categoryId:int}")]
    public async Task<IActionResult> Create([FromBody] CreateVideoRequestDto videoDto, [FromRoute] int categoryId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      try
      {
        // Download the video from the URL
        var videoUrl = videoDto.VideoURL; // Assume this is the URL in your DTO
        var tempFilePath = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.mp4");

        using (var httpClient = new HttpClient())
        {
          var videoBytes = await httpClient.GetByteArrayAsync(videoUrl);
          await System.IO.File.WriteAllBytesAsync(tempFilePath, videoBytes);
        }

        // Extract metadata using MediaToolkit
        var inputFile = new MediaFile { Filename = tempFilePath };
        using (var engine = new Engine())
        {
          engine.GetMetadata(inputFile);
        }

        var userEmail = User.GetUserEmail();
        var user = await _userManager.FindByEmailAsync(userEmail);

        if (user == null) return Unauthorized("user not found");

        var userId = user.Id;

        // Add duration to your model
        var videoModel = videoDto.ToVideoFromCreateDto();
        videoModel.CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow); 
        videoModel.videoDuration = inputFile.Metadata.Duration;

        videoModel.AppUserId = userId; // Set the userId here

        // Pass both videosDto and categoryID to CreateAsync
        videoModel = await _videoRepo.CreateAsync(videoModel, categoryId);

        // Clean up temporary file
        System.IO.File.Delete(tempFilePath);

        // Return the response
        return CreatedAtAction(nameof(GetById), new { videoId = videoModel.VideoId }, videoModel.ToVideoDto());
      }
      catch (Exception ex)
      {
        // Handle the exception (log it, return an error response, etc.)
        return StatusCode(500, new { Message = "An error occurred while processing the video.", Error = ex.Message });
      }
    }

    //Update endpoint to update a video details
    [HttpPatch("{videoId:int}")]
    public async Task<IActionResult> Update([FromRoute] int videoId, [FromBody] UpdateVideoRequestDto updateDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var videoModel = await _videoRepo.UpdateAsync(videoId, updateDto);
      if (videoModel == null)
      {
        return BadRequest("Video is not found");
      }

      return Ok(videoModel.ToVideoDto());
    }

    //Delete endpoint to delete a video
    [HttpDelete]
    [Route("{videoId:int}")]
    public async Task<IActionResult> Delete([FromRoute] int videoId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var videoModel = await _videoRepo.DeleteAsync(videoId);

      if (videoModel == null)
      {
        return BadRequest("Video is not found");
      }

      return NoContent();
    }
  }
}