using Core.Dtos;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specification;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly ICartService _cartService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;

    public PaymentService(ICartService cartService, IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        this._cartService = cartService;
        this._unitOfWork = unitOfWork;
        this._configuration = configuration;
    }
    public async Task<CartDto> CreateOrUpdatePaymentIntnet(string cartId)
    {
        StripeConfiguration.ApiKey = _configuration["StripeSettings:SecretKey"];
        var cart = await _cartService.GetCartItems(cartId);

        if (cart == null)
            return null;

        var shippingPrice = 0m;

        if (cart.DeliveryMethodId.HasValue)
        {
            var dm = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            shippingPrice = dm.Price;
        }

        foreach (var item in cart.CartItems)
        {
            var productItem = await _unitOfWork.Repository<Core.Entities.Product>().GetByIdAsync(item.Id);
            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

        var service = new PaymentIntentService();
        PaymentIntent intent;
        if (string.IsNullOrEmpty(cart.PaymentIntnetId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.CartItems.Sum(prd => (prd.Price * 100) * (prd.Quantity)) + (long)shippingPrice * 100,
                Currency = "usd",
                PaymentMethodTypes = new List<string>
                {
                    "card"
                }
            };
            intent = await service.CreateAsync(options);
            cart.PaymentIntnetId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = (long)cart.CartItems.Sum(prd => (prd.Price * 100) * (prd.Quantity)) + (long)shippingPrice * 100,
            };
            await service.UpdateAsync(cart.PaymentIntnetId, options);
        }

        await _cartService.SaveCart(cartId, cart);

        return cart;
    }

    public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntnetId)
    {
        var spec = new OrderByPaymentIntentIdSpecification(paymentIntnetId);
        var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        if (order is null) return null;

        order.Status = OrderStatus.PaymentReceived;
        await _unitOfWork.Complete();

        return order;
    }
    public async Task<Order> UpdateOrderPaymentFailed(string paymentIntnetId)
    {
        var spec = new OrderByPaymentIntentIdSpecification(paymentIntnetId);
        var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        if (order is null) return null;

        order.Status = OrderStatus.PaymentFailed;
        await _unitOfWork.Complete();
        return order;
    }

}
