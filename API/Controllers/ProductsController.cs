using API.Extensions;
using Core.Helpers;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ProductsController : BaseApiController
    {
        private readonly IProductsService _productsService;

        public ProductsController(IProductsService productsService)
        {
            this._productsService = productsService;



        }

        [HttpGet("getProducts")]
        [Authorize]
        public async Task<ActionResult> GetProducts([FromQuery] ProductsParams productsParams)
        {
            var user = User;
            var products = await _productsService.GetProducts(productsParams);
            Response.AddPaginationHeader(
                new PaginationHeader(products.CurrentPage, products.ItemsPerPage, products.ItemsCount, products.TotalPages));

            return Ok(products);
        }

        [HttpGet("getProducts/{id}")]
        public async Task<ActionResult> GetProduct(int id)
        {
            var product = await _productsService.GetProduct(id);
            if (product is null) return BadRequest("Product not found");

            return Ok(product);
        }
        [Authorize]
        [HttpPost("AddToCart/{id}")]
        public async Task<ActionResult> AddToCart(int id)
        {
            var user = User;
            return Ok();
        }

    }
}
