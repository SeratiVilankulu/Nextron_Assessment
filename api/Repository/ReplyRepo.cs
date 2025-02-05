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
  public class ReplyRepo : IReplyRepository
  {
    private readonly ApplicationDBContext _context;
    public ReplyRepo(ApplicationDBContext context)
    {
      _context = context;
    }

    public async Task<Reply> CreateAsync(Reply replyModel)
    {
      await _context.Replies.AddAsync(replyModel);
      await _context.SaveChangesAsync();
      return replyModel;
    }

    public async Task<Reply?> DeleteAsync(int id)
    {
      var replyModel = await _context.Replies.FirstOrDefaultAsync(r => r.ReplyId == id);

      if (replyModel == null)
      {
        return null;
      }

      _context.Replies.Remove(replyModel);
      await _context.SaveChangesAsync();

      return replyModel;
    }

    public async Task<List<Reply>> GetAllAsync()
    {
      return await _context.Replies
      .Include(c => c.AppUser)
      .ToListAsync();
    }

    public async Task<Reply?> GetByIdAsync(int id)
    {
      return await _context.Replies.FindAsync(id);
    }

    public async Task<List<Reply>> GetByReviewIdAsync(int reviewId)
    {
      return await _context.Replies
     .Where(c => c.ReviewId == reviewId)
     .Include(c => c.AppUser)
     .ToListAsync();
    }

    public async Task<Reply?> UpdateAsync(int id, Reply replyModel)
    {
      var existingReply = await _context.Replies.FindAsync(id);

      if (existingReply == null)
      {
        return null;
      }

      existingReply.ReplyText = replyModel.ReplyText;

      await _context.SaveChangesAsync();

      return existingReply;
    }
  }
}