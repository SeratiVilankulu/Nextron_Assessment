using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Video;
using api.Models;

namespace api.Mappers
{
  public static class VideoMappers
  {
    public static VideoDto ToVideoDto(this Video videoModel)
    {
      return new VideoDto
      {
        VideoId = videoModel.VideoId,
        Title = videoModel.Title,
        Description = videoModel.Description,
        ThumbnailURL = videoModel.ThumbnailURL,
        VideoURL = videoModel.VideoURL,
        IsPublic = videoModel.IsPublic,
        CreatedAt = videoModel.CreatedAt,
        Reviews = videoModel.Reviews.Select(r => r.ToReviewDto()).ToList(),
        // CreatorUserName = videoModel.AppUser != null ? videoModel.AppUser.UserName : "Unknown"
      };
    }

    public static Video ToVideoFromCreateDto(this CreateVideoRequestDto videoDto)
    {
      return new Video
      {
        Title = videoDto.Title,
        Description = videoDto.Description,
        ThumbnailURL = videoDto.ThumbnailURL,
        VideoURL = videoDto.VideoURL,
        IsPublic = videoDto.IsPublic,
      };
    }
  }
}