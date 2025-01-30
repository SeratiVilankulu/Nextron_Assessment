using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
  public class Category
  {
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

    public List<VideoCategory> VideoCategories { get; set; } = new List<VideoCategory>();
  }
}