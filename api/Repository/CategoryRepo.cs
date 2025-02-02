using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
  public class CategoryRepo : ICategoryRepository
  {
    private readonly ApplicationDBContext _context;
    public CategoryRepo(ApplicationDBContext context)
    {
      _context = context;
    }

    public async Task<Category> CreateAsync(Category categoryModel)
    {
      await _context.Categories.AddAsync(categoryModel);
      await _context.SaveChangesAsync();
      return categoryModel;
    }

    public async Task<List<Category>> GetAllAsync()
    {
      return await _context.Categories.ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
      return await _context.Categories.FindAsync(id);
    }
  }
}