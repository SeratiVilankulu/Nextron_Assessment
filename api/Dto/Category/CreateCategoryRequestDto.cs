using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Category
{
    public class CreateCategoryRequestDto
  {
    [Required]
    [MinLength(3, ErrorMessage = "Please enter category type of video")]
    public string CategoryName { get; set; } = string.Empty;
  }
}