using Core.Dtos;
using Core.Helpers;

namespace Core.Interfaces
{
    public interface IProductsService
    {
        Task<PagedList<ProductDto>> GetProducts(ProductsParams productsParams);
        Task<ProductDto> GetProduct(int id);
        Task<bool> IsProductExist(int id);
    }
}
