namespace Core.Dtos
{
    public class CartDto
    {
        public List<CartItemDto> CartItems { get; set; }
        public CartDto()
        {
            CartItems = new List<CartItemDto>();
        }
    }
}
