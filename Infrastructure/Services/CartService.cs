using AutoMapper;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class CartService : ICartService
    {
        private readonly IDatabase _database;
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CartService(IConnectionMultiplexer redis, DataContext context, IMapper mapper)
        {
            _database = redis.GetDatabase();
            this._context = context;
            this._mapper = mapper;
        }
        public async Task AddToCart(int productId, string basketId)
        {
            var product = _mapper.Map<ProductDto>(await _context.Products
                .Include(prd => prd.Images)
                .FirstOrDefaultAsync(prd => prd.Id == productId));
            var cart = await GetCartItems(basketId);
            if (cart is null)
            {
                cart = new CartDto();
                CartItemDto cartItem = new CartItemDto
                {
                    Product = product,
                    Quantity = 1

                };
                cart.CartItems.Add(cartItem);
            }
            else
            {
                var cartItem = cart.CartItems.FirstOrDefault(c => c.Product.Id == productId);
                if (cartItem is null)
                {
                    cart.CartItems.Add(new CartItemDto
                    {
                        Product = product,
                        Quantity = 1
                    });
                }
                else
                {
                    cartItem.Quantity++;
                }
            }

            await SaveBasket(basketId, cart);
        }


        public async Task<CartDto> GetCartItems(string basketId)
        {
            var data = await _database.StringGetAsync(basketId);
            if (data.IsNullOrEmpty) return null;
            var cart = JsonSerializer.Deserialize<CartDto>(data);
            return cart;
        }

        public async Task<bool> UpdateCartQuantity(int productId, string basketId, int quantity)
        {
            var basket = await GetCartItems(basketId);
            var basketItem = basket.CartItems.Find(ci => ci.Product.Id == productId);
            if (basketItem is not null)
            {
                basketItem.Quantity = quantity;
                await SaveBasket(basketId, basket);
                return true;
            }
            return false;
        }
        public async Task SaveBasket(string basketId, object value)
        {
            await _database.StringSetAsync(basketId, JsonSerializer.Serialize(value));

        }

    }
}
