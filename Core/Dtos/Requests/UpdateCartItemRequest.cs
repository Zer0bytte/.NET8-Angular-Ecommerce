namespace Core.Dtos.Requests
{
    public class UpdateCartItemRequest
    {
        public int ProductId { get; set; }
        public string BasketId { get; set; }
        public int Quantity { get; set; }
    }
}
