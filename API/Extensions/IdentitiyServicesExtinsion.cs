using Core.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions
{
    public static class IdentitiyServicesExtinsion
    {
        public static IServiceCollection AddIdentitiyServices(this IServiceCollection services, IConfiguration config)
        {

            services.AddAuthorization();

            services
                .AddIdentityApiEndpoints<AppUser>()
                .AddEntityFrameworkStores<DataContext>();

            services.AddOptions<BearerTokenOptions>(IdentityConstants.BearerScheme).Configure(options => {
                options.BearerTokenExpiration = TimeSpan.FromDays(15);
            });

            return services;
        }
    }
}
