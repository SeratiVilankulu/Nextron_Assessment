using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Video
{
  public class VideoDto
  {
    public int VideoId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ThumbnailURL { get; set; } = string.Empty;
    public string VideoURL { get; set; } = string.Empty;
    public int Duration { get; set; }
    public bool IsPublic { get; set; } = false;
    public DateOnly CreateAt { get; set; }
  }
}