using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Video;
using api.Interfaces;
using api.Mappers;
using MediaToolkit;
using MediaToolkit.Model;
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

    public VideoController(ApplicationDBContext context, IVideoRepository videoRepo)
    {
      _videoRepo = videoRepo;
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var videos = await _videoRepo.GetAllAsync();

      var videosDto = videos.Select(v => v.ToVideoDto());

      return Ok(videos);
    }

    [HttpGet("{videoId:int}")]
    public async Task<IActionResult> GetById([FromRoute] int videoId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var video = await _videoRepo.GetByIdAsync(videoId);
      if (video == null)
      {
        return NotFound();
      }
      return Ok(video.ToVideoDto());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVideoRequestDto videoDto)
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

        // Add duration to your model
        var videoModel = videoDto.ToVideoFromCreateDto();
        videoModel.CreatedAt = DateOnly.FromDateTime(DateTime.Now);
        videoModel.videoDuration = inputFile.Metadata.Duration;

        // Save to the database
        await _videoRepo.CreateAsync(videoModel);

        // Clean up temporary file
        System.IO.File.Delete(tempFilePath);

        // Return the response
        return CreatedAtAction(nameof(GetById), new { id = videoModel.VideoId }, videoModel.ToVideoDto());
      }
      catch (Exception ex)
      {
        // Handle the exception (log it, return an error response, etc.)
        return StatusCode(500, new { Message = "An error occurred while processing the video.", Error = ex.Message });
      }
    }

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