using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto;
using api.Dto.Video;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [Route("api/video")]
  [ApiController]
  public class VideoController : ControllerBase
  {
    private readonly ApplicationDBContext _context;

    public VideoController(ApplicationDBContext context)
    {
      _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
      var videos = _context.Videos.ToList()
      .Select(v => v.ToVideoDto());

      return Ok(videos);
    }

    [HttpGet("{id}")]
    public IActionResult GetById([FromRoute] int id)
    {
      var video = _context.Videos.Find(id);
      if (video == null)
      {
        return NotFound();
      }
      return Ok(video.ToVideoDto());
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateVideoRequestDto videoDto)
    {
      var videoModel = videoDto.ToVideoFromCreateDto();
      videoModel.CreateAt = DateOnly.FromDateTime(DateTime.Now);

      _context.Videos.Add(videoModel);
      _context.SaveChanges();
      return CreatedAtAction(nameof(GetById), new { id = videoModel.VideoId }, videoModel.ToVideoDto());
    }

    [HttpPatch("{id}")]
    public IActionResult Update([FromRoute] int id, [FromBody] UpdateVideoRequestDto updateDto)
    {

      var videoModel = _context.Videos.FirstOrDefault(v => v.VideoId == id);
      if (videoModel == null)
      {
        return BadRequest("Video is not found");
      }

      videoModel.Title = updateDto.Title;
      videoModel.Description = updateDto.Description;
      videoModel.Category = updateDto.Category;
      videoModel.ThumbnailURL = updateDto.ThumbnailURL;
      videoModel.VideoURL = updateDto.VideoURL;
      videoModel.Duration = updateDto.Duration;
      videoModel.IsPublic = updateDto.IsPublic;

      _context.SaveChanges();
      return Ok(videoModel.ToVideoDto());
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete([FromRoute] int id)
    {
      var videoModel = _context.Videos.FirstOrDefault(v => v.VideoId == id);
      if (videoModel == null)
      {
        return BadRequest("Video is not found");
      }

      _context.Videos.Remove(videoModel);
      _context.SaveChanges();
      return NoContent();
    }
  }
}