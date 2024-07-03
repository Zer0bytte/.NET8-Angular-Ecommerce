namespace Core.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public float Price { get; set; }
        public int Stock { get; set; }
        public string Tags { get; set; }
        public string Brand { get; set; }
        public string Description { get; set; }
        public Category Category { get; set; }
        public int CategoryId { get; set; }
        public List<ProductImage> Images { get; set; }
    }
}
