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

    public static Review ToReviewFromCreate(this CreateReviewDto reviewDto, int videoId)
    {
      return new Review
      {
        Rating = reviewDto.Rating,
        ReviewText = reviewDto.ReviewText,
        VideoId = videoId
      };
    }

    public static Review ToReviewFromUpdate(this UpdateReviewRequestDto reviewDto)
    {
      return new Review
      {
        Rating = reviewDto.Rating,
        ReviewText = reviewDto.ReviewText,
      };
    }
  }
}