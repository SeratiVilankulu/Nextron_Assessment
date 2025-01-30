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
        Category = videoModel.Category,
        ThumbnailURL = videoModel.ThumbnailURL,
        VideoURL = videoModel.VideoURL,
        Duration = videoModel.Duration,
        IsPublic = videoModel.IsPublic,
        CreateAt = videoModel.CreateAt
      };
    }

    public static Video ToVideoFromCreateDto(this CreateVideoRequestDto videoDto)
    {
      return new Video
      {
        Title = videoDto.Title,
        Description = videoDto.Description,
        Category = videoDto.Category,
        ThumbnailURL = videoDto.ThumbnailURL,
        VideoURL = videoDto.VideoURL,
        Duration = videoDto.Duration,
        IsPublic = videoDto.IsPublic,
      };
    }
  }
}