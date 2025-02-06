using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Review
  {
    public int ReviewId { get; set; }
    public int Rating { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public DateOnly? CreatedAt { get; set; }

    // Foreign Key Properties
    public int? VideoId { get; set; }
    public Video? Videos { get; set; }


    public string? AppUserId { get; set; }
    public AppUser? AppUser { get; set; }

    public List<Reply> Replies { get; set; } = new List<Reply>();
  }
}