namespace Core.Dtos
{
    public class CartDto
    {
        public List<CartItemDto> CartItems { get; set; }
        public string Id { get; set; }

        public string ClientSecret { get; set; }
        public int? DeliveryMethodId { get; set; }
        public decimal ShippingPrice { get; set; }
        public string PaymentIntnetId { get; set; }
        public CartDto()
        {
            CartItems = new List<CartItemDto>();
        }
    }
}
