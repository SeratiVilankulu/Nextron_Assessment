using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;
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
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      List<IdentityRole> roles = new List<IdentityRole>
      {
        new IdentityRole
        {
          Id = "d2f32c28-5d6f-4e44-98b9-9a3e5f89cd9a",
          Name="Admin",
          NormalizedName = "ADMIN",
        },
        new IdentityRole
        {
          Id = "a1f75c23-b7ad-43a3-925d-c8c417e8b9b7",
          Name="User",
          NormalizedName="USER",
        }
      };

      modelBuilder.Entity<IdentityRole>().HasData(roles);
    }
  }
}