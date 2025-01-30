using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Reply
  {
    public int ReplyId { get; set; }
    public string ReplyText { get; set; } = string.Empty;
    public DateOnly CreatedAt { get; set; }
    public DateOnly? UpdatedAt { get; set; }

    // Foreign Key Properties
    public string? AppUserId { get; set; }
    public AppUser? AppUsers { get; set; }
  }
}