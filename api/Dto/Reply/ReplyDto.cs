using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Reply
{
  public class ReplyDto
  {
    public int ReplyId { get; set; }
    public string ReplyText { get; set; } = string.Empty;
    public DateOnly CreatedAt { get; set; }
    public DateOnly? UpdatedAt { get; set; }
  }
}