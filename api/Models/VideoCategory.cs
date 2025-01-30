using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class VideoCategory
    {
      public int VideoCategoryID { get; set; }
      public int VideoID { get; set; }
      public Video? Video { get; set; } = null!;
      public int CategoryID { get; set; }
      public Category? Category { get; set; } = null!;
    }
}