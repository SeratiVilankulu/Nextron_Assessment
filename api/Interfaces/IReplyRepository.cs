using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
  public interface IReplyRepository
  {
    Task<List<Reply>> GetAllAsync();
    Task<Reply?> GetByIdAsync(int id);
    Task<List<Reply>> GetByReviewIdAsync(int reviewId);
    Task<Reply> CreateAsync(Reply replyModel);
    Task<Reply?> UpdateAsync(int id, Reply replyModel);
    Task<Reply?> DeleteAsync(int id);
  }
}