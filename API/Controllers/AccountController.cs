
using API.Extensions;
using AutoMapper;
using Core.Dtos.Requests;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, IMapper mapper)
        {
            this._userManager = userManager;
            this._mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetUserAddress()
        {
            var userAddress = await User.GetUserAddressAsync(_userManager);
            return Ok(_mapper.Map<AddressDto>(userAddress));
        }
    }
}
