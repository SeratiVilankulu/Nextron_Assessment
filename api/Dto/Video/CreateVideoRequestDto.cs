using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Video
{
  public class CreateVideoRequestDto
  {
    [Required]
    [MaxLength(50, ErrorMessage = "Text cannot exceeded the character length")]
    public string Title { get; set; } = string.Empty;
    [Required]
    [MaxLength(255, ErrorMessage = "Text cannot exceeded the character length")]
    public string Description { get; set; } = string.Empty;
    [Required]
    public string ThumbnailURL { get; set; } = string.Empty;
    [Required]
    public string VideoURL { get; set; } = string.Empty;
    [Required]
    public bool IsPublic { get; set; } = false;
  }
}