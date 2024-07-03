using API.Extensions;
using Azure.Core;
using Core.Dtos;
using Core.Dtos.Requests;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        private readonly ICartService _cartService;
        private readonly IProductsService _productsService;
        private readonly UserManager<AppUser> _userManager;

        public CartController(ICartService cartService, IProductsService productsService, UserManager<AppUser> userManager)
        {
            this._cartService = cartService;
            this._productsService = productsService;
            this._userManager = userManager;
        }


        [HttpPost("AddToShoppingCart")]
        public async Task<ActionResult> AddProductToCart([FromBody] AddToCartRequest request)
        {
            var productExist = await _productsService.IsProductExist(request.ProductId);
            if (!productExist) return BadRequest("Failed to add this product to cart");

            bool isUserAuthenticated = (User != null) && User.Identity.IsAuthenticated;
            if (isUserAuthenticated)
            {
                //await _cartService.AddToCart(request.ProductId, User.GetUserId());
            }
            else
            {

            }

            await _cartService.AddToCart(request.ProductId, request.CartId);
            return Ok("Item added to cart");
        }

        [HttpGet("GetCartItems/{id}")]
        public async Task<ActionResult<CartDto>> GetCartItems(string id)
        {
            CartDto cartDto;
            bool isUserAuthenticated = (User != null) && User.Identity.IsAuthenticated;
            if (isUserAuthenticated)
            {
                cartDto = await _cartService.GetCartItems(User.GetUserId());
            }
            else
            {
            }

            cartDto = await _cartService.GetCartItems(id);
            if (cartDto is null) return BadRequest("Failed to get cart items");

            return Ok(cartDto);
        }

        [HttpPost("UpdateCartItem")]
        public async Task<ActionResult> UpdateCartItem(UpdateCartItemRequest updateRequest)
        {
            var result = await this._cartService.UpdateCartQuantity(updateRequest.ProductId, updateRequest.BasketId, updateRequest.Quantity);
            if (result)
            {
                return Ok("Cart updated successfully");
            }
            return BadRequest("Failed to update cart item!");
        }
    }
}

