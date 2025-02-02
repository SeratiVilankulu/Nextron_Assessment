using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
  public interface ICategoryRepository
  {
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int id);
    Task<Category> CreateAsync(Category categoryModel);
  }
}