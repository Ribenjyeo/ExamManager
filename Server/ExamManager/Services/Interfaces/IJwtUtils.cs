using ExamManager.Models;
using System;
using System.Security.Claims;

namespace ExamManager.Services;
public interface IJwtUtils
{
    public string GenerateJSONWebToken(User user);

    public ClaimsPrincipal ValidateToken(string token);

}