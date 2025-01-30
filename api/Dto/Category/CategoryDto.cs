using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Category
{
  public class CategoryDto
  {
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
  }
}