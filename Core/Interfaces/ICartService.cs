using Core.Dtos;
using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ICartService
    {
        Task AddToCart(int productId,string cartId);
        Task<CartDto> GetCartItems(string cartId);

        Task<bool> UpdateCartQuantity(int productId, string cartId, int quantity);
        Task SaveCart(string cartId, object value);

        Task DeleteCart(string cartId);
    }
}
