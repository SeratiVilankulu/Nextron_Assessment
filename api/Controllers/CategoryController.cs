using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Category;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [Route("api/category")]
  [ApiController]
  public class CategoryController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly ICategoryRepository _categoryRepo;
    public CategoryController(ApplicationDBContext context, ICategoryRepository categoryRepo)
    {
      _context = context;
      _categoryRepo = categoryRepo;
    }


    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var categories = await _categoryRepo.GetAllAsync();

      var categoryDto = categories.Select(c => c.ToCategoryDto());

      return Ok(categories);
    }

    [HttpGet("{categoryId:int}")]
    public async Task<IActionResult> GetById([FromRoute] int categoryId)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var category = await _categoryRepo.GetByIdAsync(categoryId);

      if (category == null)
      {
        return NotFound();
      }

      return Ok(category.ToCategoryDto());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequestDto categoriesDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var categoryModel = categoriesDto.ToCategoryFromCreate();

      await _categoryRepo.CreateAsync(categoryModel);

      return CreatedAtAction(nameof(GetById), new { categoryId = categoryModel.CategoryId }, categoryModel.ToCategoryDto());
    }
  }
}