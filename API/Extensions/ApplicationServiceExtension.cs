
using API.MappingProfiles;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace API.Extinsions
{
    public static class ApplicationServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddAutoMapper(typeof(MapperProfile));
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var options = ConfigurationOptions.Parse(config.GetConnectionString("Redis"));
                return ConnectionMultiplexer.Connect(options);
            });
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IProductsService, ProductService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddCors();
            return services;
        }
    }
}
