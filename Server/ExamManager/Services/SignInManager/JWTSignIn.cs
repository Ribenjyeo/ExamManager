using ExamManager.Models;

namespace ExamManager.Services;
public static class JWTSignIn
{
    public static string UsingJWT(this LogIn logIn, User user)
    {
        var jwtUtils = logIn.GetService<IJwtUtils>();

        return jwtUtils.GenerateJSONWebToken(user);
    }
}