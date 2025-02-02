using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Category;
using api.Models;

namespace api.Mappers
{
    public static class CategoryMappers
    {
    public static CategoryDto ToCategoryDto(this Category categoryModel)
    {
      if (categoryModel == null)
      {
        return null;
      }

      return new CategoryDto
      {
        CategoryName = categoryModel.CategoryName,
        CategoryId = categoryModel.CategoryId,
      };
    }

    public static Category ToCategoryFromCreate(this CreateCategoryRequestDto categoryDto)
    {
      return new Category
      {
        CategoryName = categoryDto.CategoryName,
      };
    }
  }
}