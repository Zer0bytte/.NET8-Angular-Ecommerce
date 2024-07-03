using Core.Entities;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Infrastructure.Seeds
{
    public static class Seeds
    {
        public static async void SeedCategories(DataContext context)
        {
            if (await context.Categories.AnyAsync()) return;

            await context.Categories.AddAsync(new Category { Name = "Books", });
            await context.Categories.AddAsync(new Category { Name = "Mobiles", });

        }


        public static async void SeedFakeCategories(DataContext context)
        {
            var request = await new HttpClient().GetAsync("https://dummyjson.com/products?limit=200");
            string response = await request.Content.ReadAsStringAsync();
            Root products = JsonConvert.DeserializeObject<Root>(response);

            foreach (var product in products.products)
            {
                if (!context.Categories.Any(c => c.Name == product.category))
                {
                    context.Categories.Add(new Category { Name = product.category });
                }
            }

            context.SaveChanges();

        }

        public static async void SeedFakeProducts(DataContext context)
        {
            var request = await new HttpClient().GetAsync("https://dummyjson.com/products?limit=200");
            string response = await request.Content.ReadAsStringAsync();
            Root products = JsonConvert.DeserializeObject<Root>(response);

            foreach (var product in products.products)
            {
                int categoryId = context.Categories.FirstOrDefault(c => c.Name == product.category).Id;
                var dbProduct = new Product
                {
                    CategoryId = categoryId,
                    Title = product.title,
                    Price = product.price,
                    Brand = product.brand,
                    Stock = product.stock,
                    Description = product.description,
                    Tags = string.Join(';', product.tags)
                };
                dbProduct.Images = new List<ProductImage>();

                foreach (var image in product.images)
                {
                    dbProduct.Images.Add(new ProductImage
                    {
                        ImageUrl = image
                    });
                }

                context.Products.Add(dbProduct);
            }
            context.SaveChanges();

        }
        public static async void SeedProducts(DataContext context)
        {
            if (await context.Products.AnyAsync()) return;

            context.Products.Add(new Product
            {
                Title = "The laws of human nature",
                Price = 155,
                CategoryId = 1,
                Description = "Dark pshychology",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        ImageUrl = @"D:\images\كشافه\كلر داي 2023\2023_07_18_09_13_IMG_2711.JPG",
                    }
                }
            });


            context.Products.Add(new Product
            {
                Title = "IPhone 11",
                Price = 560,
                CategoryId = 2,
                Description = "Iphone",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        ImageUrl = @"D:\images\كشافه\كلر داي 2023\2023_07_18_09_13_IMG_2711.JPG",
                    }
                }
            });


            context.Products.Add(new Product
            {
                Title = "IPhone 11 Pro",
                Price = 600,
                CategoryId = 2,
                Description = "Iphone",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        ImageUrl = @"D:\images\كشافه\كلر داي 2023\2023_07_18_09_13_IMG_2711.JPG",
                    }
                }
            });

            context.Products.Add(new Product
            {
                Title = "IPhone 12",
                Price = 623,
                CategoryId = 2,
                Description = "Iphone",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        ImageUrl = @"D:\images\كشافه\كلر داي 2023\2023_07_18_09_13_IMG_2711.JPG",
                    }
                }
            });

            context.Products.Add(new Product
            {
                Title = "IPhone 12 Pro",
                Price = 650,
                CategoryId = 2,
                Description = "Iphone",
                Images = new List<ProductImage>
                {
                    new ProductImage
                    {
                        ImageUrl = @"D:\images\كشافه\كلر داي 2023\2023_07_18_09_13_IMG_2711.JPG",
                    }
                }
            });
            await context.SaveChangesAsync();
        }
    }
}
