using Core.Entities.Identity;

namespace Core.Entities
{
    public class CartItem
    {
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
    }
}
