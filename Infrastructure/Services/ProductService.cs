using AutoMapper;
using Core.Dtos;
using Core.Helpers;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class FakeProduct
    {
        public int id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string category { get; set; }
        public string brand { get; set; }
        public float price { get; set; }
        public int stock { get; set; }
        public string[] tags { get; set; }
        public List<string> images { get; set; }

    }
    public class Root
    {
        public List<FakeProduct> products { get; set; }
        public int total { get; set; }
        public int skip { get; set; }
        public int limit { get; set; }
    }

    public class ProductService : IProductsService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<ProductDto> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<PagedList<ProductDto>> GetProducts(ProductsParams productsParams)
        {
            var products = _context.Products.AsQueryable().Select(prd => new ProductDto
            {
                Id = prd.Id,
                Title = prd.Title,
                Price = prd.Price,
                Description = prd.Description,
                Images = prd.Images,
                Category = prd.Category,
                CategoryId = prd.CategoryId,
                Stock = prd.Stock,
                Brand = prd.Brand,
                Tags = prd.Tags
            });

            return await PagedList<ProductDto>.CreateAsync(products, productsParams.PageNumber, productsParams.PageSize);
        }

        public async Task<bool> IsProductExist(int id)
        {
            return await _context.Products.AnyAsync(prd => prd.Id == id);
        }
    }
}
