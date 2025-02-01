using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto;
using api.Dto.Video;
using api.Models;

namespace api.Interfaces
{
  public interface IVideoRepository
  {
    Task<List<Video>> GetAllAsync();
    Task<Video?> GetByIdAsync(int id);
    Task<Video> CreateAsync(Video videoModel);
    Task<Video> UpdateAsync(int id, UpdateVideoRequestDto updateDto);
    Task<Video?> DeleteAsync(int id);
    Task<bool> VideoExists(int id);
  }
}