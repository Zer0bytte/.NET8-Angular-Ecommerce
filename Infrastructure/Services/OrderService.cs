using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specification;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICartService _cartService;

        public OrderService(IUnitOfWork unitOfWork, ICartService cartService)
        {
            this._unitOfWork = unitOfWork;
            this._cartService = cartService;
        }
        public async Task<Order> CreateOrder(string buyerEmail, int deliveryMethodId, string cartId, Address shippingAddress)
        {
            var cart = await _cartService.GetCartItems(cartId);
            if (cart == null) return null;


            var items = new List<OrderItem>();

            foreach (var item in cart.CartItems)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Product.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Title, item.Product.Images[0].ImageUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            var subTotal = items.Sum(item => item.Price * item.Quantity);

            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subTotal);
            _unitOfWork.Repository<Order>().Add(order);
            var result = await _unitOfWork.Complete();
            if (result <= 0) return null;

            await _cartService.DeleteCart(cartId);
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrderWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrderWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}
