using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Review
{
  public class UpdateReviewRequestDto
  {

    [MaxLength(255, ErrorMessage = "Text cannot exceeded the character length")]
    public string ReviewText { get; set; } = string.Empty;

  }
}