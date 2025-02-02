using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Reply
{
  public class CreateReplyDto
  {
    [MaxLength(255, ErrorMessage = "Text cannot exceeded the character length")]

    public string ReplyText { get; set; } = string.Empty;
  }
}