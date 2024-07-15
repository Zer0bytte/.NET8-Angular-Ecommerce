using AutoMapper;
using AutoMapper.Execution;
using Core.Dtos;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specification;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class CartService : ICartService
    {
        private readonly IDatabase _database;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CartService(IConnectionMultiplexer redis, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _database = redis.GetDatabase();
            this._unitOfWork = unitOfWork;
            this._mapper = mapper;
        }
        public async Task AddToCart(int productId, string cartId)
        {

            var spec = new ProductIncludeImagesRefSpecification(productId);

            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);


            var cart = await GetCartItems(cartId);
            if (cart is null)
            {
                cart = new CartDto();
                CartItemDto cartItem = _mapper.Map<CartItemDto>(product);
                cartItem.Quantity = 1;
                cart.CartItems.Add(cartItem);
            }
            else
            {
                CartItemDto cartItem = cart.CartItems.FirstOrDefault(c => c.Id == productId);
                if (cartItem is null)
                {
                    cartItem = _mapper.Map<CartItemDto>(product);
                    cartItem.Quantity = 1;
                    cart.CartItems.Add(cartItem);
                }
                else
                {
                    cartItem.Quantity++;
                }
            }

            await SaveCart(cartId, cart);
        }


        public async Task<CartDto> GetCartItems(string cartId)
        {
            var data = await _database.StringGetAsync(cartId);
            if (data.IsNullOrEmpty) return null;
            var cart = JsonSerializer.Deserialize<CartDto>(data);
            cart.Id = cartId;
            return cart;
        }

        public async Task<bool> UpdateCartQuantity(int productId, string cartId, int quantity)
        {
            var cart = await GetCartItems(cartId);
            var cartItem = cart.CartItems.Find(ci => ci.Id == productId);
            if (cartItem is not null)
            {
                cartItem.Quantity = quantity;
                await SaveCart(cartId, cart);
                return true;
            }
            return false;
        }
        public async Task SaveCart(string cartId, object value)
        {
            await _database.StringSetAsync(cartId, JsonSerializer.Serialize(value));

        }

        public async Task DeleteCart(string cartId)
        {
            var result = await _database.KeyDeleteAsync(cartId);
        }

        public async Task SetCartDeliveryMethod(string cartId, int dmId)
        {

            var cart = await GetCartItems(cartId);
            cart.DeliveryMethodId = dmId;
            var dM = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(dmId);
            if (dM != null)
            {
                cart.ShippingPrice = dM.Price;

            }
            await SaveCart(cartId, cart);
        }
    }
}
