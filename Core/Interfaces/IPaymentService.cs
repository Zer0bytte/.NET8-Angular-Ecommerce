using Core.Dtos;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces;

public interface IPaymentService
{
    Task<CartDto> CreateOrUpdatePaymentIntnet(string cartId);
    Task<Order> UpdateOrderPaymentSucceeded(string paymentIntnetId);
    Task<Order> UpdateOrderPaymentFailed(string paymentIntnetId);
}
