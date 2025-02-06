using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dto.Account;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
  [Route("api/account")]
  [ApiController]
  public class UsersController : ControllerBase
  {
    private readonly ApplicationDBContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly SignInManager<AppUser> _signinManager;
    public UsersController(ApplicationDBContext context, UserManager<AppUser> userManager,
    ITokenService tokenService, SignInManager<AppUser> signInManager)
    {
      _context = context;
      _userManager = userManager;
      _tokenService = tokenService;
      _signinManager = signInManager;
    }

    // Post endpoint for user registration
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
      try
      {
        // Validate the request data based on the model's attributes
        if (!ModelState.IsValid)
          return BadRequest(ModelState);

        // Create a new instance of the AppUser model with the provided email
        var appUser = new AppUser
        {
          UserName = registerDto.UserName,
          Email = registerDto.Email
        };

        // Create the user in the system with the provided password
        var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

        if (createdUser.Succeeded)
        {
          // Assign the "User" role to the newly created user
          var roleResult = await _userManager.AddToRoleAsync(appUser, "User");
          if (roleResult.Succeeded)
          {
            // Return user information and a verification token
            return Ok(
              new NewUserDto
              {
                UserName = appUser.UserName,
                Email = appUser.Email,
                VerificationToken = _tokenService.CreateToken(appUser) // Generate a token for the user
              }
            );
          }
          else
          {
            return StatusCode(500, roleResult.Errors);
          }
        }
        else
        {
          return StatusCode(500, createdUser.Errors);
        }
      }
      catch (Exception e)
      {
        return StatusCode(500, e);
      }
    }

    // Post endpoint for user login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email.ToLower());

      if (user == null)
        return Unauthorized("Invalid login credentials!");

      // Check if the password is correct, enabling account lockout for failed attempts
      var result = await _signinManager.CheckPasswordSignInAsync(user, loginDto.Password, lockoutOnFailure: false);

      if (result.Succeeded)
      {
        // Return if login is successful
        return Ok(new NewUserDto
        {
          AppUserId = user.Id,
          UserName = user.UserName,
          Email = user.Email,
          VerificationToken = _tokenService.CreateToken(user) // Generate and return a token for the user
        });
      }

      if (result.IsLockedOut)
      {
        // Handle account lockout scenario
        var accessFailedCount = await _userManager.GetAccessFailedCountAsync(user); // Get the current number of failed attempts
        var maxFailedAccessAttempts = _userManager.Options.Lockout.MaxFailedAccessAttempts; // Get the maximum allowed attempts
        var attemptsLeft = maxFailedAccessAttempts - accessFailedCount; // Calculate remaining attempts

        return Unauthorized(new
        {
          message = $"Invalid username or password. You have {attemptsLeft} attempts left."
        });
      }

      return Unauthorized(new { message = "Invalid login credentials!" });
    }

    // Get endpoint to fetch all Users
    [HttpGet("users")]
    public async Task<ActionResult> GetAllUsers()
    {
      if (!ModelState.IsValid)
        return BadRequest(ModelState);

      try
      {
        var users = await _context.Users
          .Include(u => u.Videos)
          .Include(u => u.Reviews)
          .Include(u => u.Replies)
          .ToListAsync();

        if (users == null || users.Count == 0)
        {
          return NotFound("No users found.");
        }

        return Ok(users);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }
  }
}