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
        Task AddToCart(int productId,string basketId);
        Task<CartDto> GetCartItems(string basketId);

        Task<bool> UpdateCartQuantity(int productId, string basketId,int quantity);
        Task SaveBasket(string basketId, object value);
    }
}
