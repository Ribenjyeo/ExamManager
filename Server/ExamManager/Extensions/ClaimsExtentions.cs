using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ExamManager.Extensions
{
    public static class ClaimKey
    {
        public static string Login { get; } = "Claim.Key.Login";
        public static string FirstName { get; } = "Claim.Key.FirstName";
        public static string MiddleName { get; } = "Claim.Key.MiddleName";
        public static string LastName { get; } = "Claim.Key.LastName";
        public static string Id { get; } = "Claim.Key.Id";
        public static string Role { get; } = "Claim.Key.Role";
        public static string CookiesId { get; } = "App.Cookies.Id";
    }

    public static class AuthenticationExtensions
    {
        public static string GetClaim(this ClaimsPrincipal claimsPrincipal, string claimKey)
        {
            var cl = claimsPrincipal?.FindFirst(claimKey)?.Value ?? string.Empty;

            return cl;
        }

        public static string GetCookieValue(this HttpRequest request, string cookieKey)
        {
            if (request.Cookies.TryGetValue(cookieKey, out var cookieValue))
            {
                return cookieValue;
            }
            return string.Empty;
        }
    }
}
