using Core.Entities;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        public static async Task<Address> GetUserAddressAsync(this ClaimsPrincipal claims, UserManager<AppUser> userManager)
        {
            var user = await userManager.Users.Include(u => u.Address)
              .SingleOrDefaultAsync(x => x.Email == claims.FindFirstValue(ClaimTypes.Email));

            return user.Address;

        }
        public static string GetUserEmail(this ClaimsPrincipal claims)
        {
            string email = claims.FindFirst(ClaimTypes.Email).Value;
            return email;

        }
    }
}
