using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class VideoCategory
    {
      public int VideoCategoryId { get; set; }
      public int VideoId { get; set; }
      public Video? Video { get; set; } = null!;
      public int CategoryId { get; set; }
      public Category? Category { get; set; } = null!;
    }
}