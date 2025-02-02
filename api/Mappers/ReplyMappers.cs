using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dto.Reply;
using api.Models;

namespace api.Mappers
{
  public static class ReplyMappers
  {
    public static ReplyDto ToReplyDto(this Reply replyModel)
    {
      return new ReplyDto
      {
        ReplyId = replyModel.ReplyId,
        ReplyText = replyModel.ReplyText,
        CreatedAt = replyModel.CreatedAt
      };
    }

    public static Reply ToReplyFromCreate(this CreateReplyDto replyDto, int reviewId)
    {
      return new Reply
      {
        ReplyText = replyDto.ReplyText,
        ReplyId = reviewId
      };
    }

    public static Reply ToReplyFromUpdate(this UpdateReplyRequestDto ReplyDto)
    {
      return new Reply
      {
        ReplyText = ReplyDto.ReplyText,
      };
    }
    
  }
}