namespace Core.Dtos
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
    }
}
