using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Review
{
  public class ReviewDto
  {
    public int ReviewId { get; set; }
    public int Rating { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public DateOnly? CreatedAt { get; set; }
  }
}