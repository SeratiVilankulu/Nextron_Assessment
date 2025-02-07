using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Review;

namespace api.Dto.Video
{
  public class VideoDto
  {
    public int VideoId { get; set; }
    public string AppUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailURL { get; set; } = string.Empty;
    public string VideoURL { get; set; } = string.Empty;
    public bool IsPublic { get; set; } = false;
    public string CreatorUserName { get; set; } = string.Empty;
    public DateOnly CreatedAt { get; set; }
    public List<ReviewDto> Reviews { get; set; }
  }
}