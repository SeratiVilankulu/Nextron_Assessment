using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Video
  {
    public int VideoId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailURL { get; set; } = string.Empty;
    public string VideoURL { get; set; } = string.Empty;
    public TimeSpan videoDuration { get; set; }
    public bool IsPublic { get; set; } = false;
    public DateOnly CreatedAt { get; set; }

    // // Foreign Key Properties
    public string? AppUserId { get; set; }
    public AppUser? AppUser { get; set; }
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    public List<Review> Reviews { get; set; } = new List<Review>();
    public List<VideoCategory> VideoCategories { get; set; } = new List<VideoCategory>();
  }
}