using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Review
{
  public class CreateReviewDto
  {
    [Required]
    [Range(0, 5)]
    public int Rating { get; set; }

    [MaxLength(255, ErrorMessage = "Text cannot exceeded the character length")]
    public string ReviewText { get; set; } = string.Empty;

  }
}