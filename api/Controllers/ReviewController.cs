using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
  [Route("api/review")]
  [ApiController]
  public class ReviewController : ControllerBase
  {
    private readonly ApplicationDBContext _context;

    public ReviewController(ApplicationDBContext context)
    {
      _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
      var reviews = _context.Reviews.ToList()
      .Select(r => r.ToReviewDto());

      return Ok(reviews);
    }

    [HttpGet("{id}")]
    public IActionResult GetById([FromRoute] int id)
    {
      var review = _context.Reviews.Find(id);
      if (review == null)
      {
        return NotFound();
      }
      return Ok(review.ToReviewDto());
    }
  }
}