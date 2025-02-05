using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dto.Account
{
  public class NewUserDto
  {
    public string AppUserId { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string VerificationToken { get; set; }
  }
}