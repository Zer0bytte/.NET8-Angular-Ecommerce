using System.Security.Claims;

namespace API.Extensions
{
    public static class UserContextExtensions
    {
        public static string GetUserId(this ClaimsPrincipal claims)
        {
            string userId = claims.FindFirst(ClaimTypes.NameIdentifier).Value;
            return userId;

        }
    }
}
