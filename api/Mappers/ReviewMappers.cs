using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Review;
using api.Models;

namespace api.Mappers
{
  public static class ReviewMappers
  {
    public static ReviewDto ToReviewDto(this Review reviewModel)
    {
      return new ReviewDto
      {
        ReviewId = reviewModel.ReviewId,
        Rating = reviewModel.Rating,
        ReviewText = reviewModel.ReviewText,
        CreatedAt = reviewModel.CreatedAt
      };
    }
  }
}