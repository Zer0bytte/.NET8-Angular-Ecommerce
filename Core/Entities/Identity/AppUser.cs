using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        public int AddressId { get; set; }
        public Core.Entities.Address Address { get; set; }
    }
}
