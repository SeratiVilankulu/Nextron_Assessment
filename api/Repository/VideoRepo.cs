using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto;
using api.Dto.Video;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
  public class VideoRepo : IVideoRepository
  {
    private readonly ApplicationDBContext _context;
    public VideoRepo(ApplicationDBContext context)
    {
      _context = context;
    }

    public async Task<Video> CreateAsync(Video videoModel)
    {
      await _context.Videos.AddAsync(videoModel);
      await _context.SaveChangesAsync();
      return videoModel;
    }

    public async Task<Video?> DeleteAsync(int id)
    {
      var videoModel = await _context.Videos.FirstOrDefaultAsync(x => x.VideoId == id);

      if(videoModel == null)
      {
        return null;
      }

      _context.Videos.Remove(videoModel);
      await _context.SaveChangesAsync();
      return videoModel;
    }

    public async Task<List<Video>> GetAllAsync()
    {
      return await _context.Videos.Include(r => r.Reviews).ToListAsync();
    }

    public async Task<Video?> GetByIdAsync(int id)
    {
      return await _context.Videos.Include(r => r.Reviews).FirstOrDefaultAsync(i => i.VideoId == id);
    }

    public async Task<Video?> UpdateAsync(int id, UpdateVideoRequestDto updateDto)
    {
      var existingVideo = await _context.Videos.FindAsync(id);

      if(existingVideo == null)
      {
        return null;
      }

      existingVideo.Title = updateDto.Title;
      existingVideo.Description = updateDto.Description;
      existingVideo.VideoURL = updateDto.VideoURL;
      existingVideo.ThumbnailURL = updateDto.ThumbnailURL;
      existingVideo.CreatedAt = DateOnly.FromDateTime(DateTime.Now);

      await _context.SaveChangesAsync();
      return existingVideo;
    }

    public Task<bool> VideoExists(int id)
    {
      return _context.Videos.AnyAsync(v => v.VideoId == id);
    }
  }
}