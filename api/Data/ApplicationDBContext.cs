using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
  public class ApplicationDBContext : IdentityDbContext<AppUser>
  {
    public ApplicationDBContext(DbContextOptions dbContextOptions)
    : base(dbContextOptions)
    {

    }
    public DbSet<Video> Videos { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Reply> Replies { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<VideoCategory> VideoCategories { get; set; }
  }
}