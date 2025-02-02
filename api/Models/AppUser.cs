using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
  public class AppUser : IdentityUser
  {
    public List<Video> Videos { get; set; } = new List<Video>();
    public List<Review> Reviews { get; set; } = new List<Review>();
    public List<Reply> Replies { get; set; } = new List<Reply>();
  }
}