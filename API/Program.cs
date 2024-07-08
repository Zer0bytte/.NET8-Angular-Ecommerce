using API.Extensions;
using API.Extinsions;
using API.Overrides;
using Core.Entities.Identity;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentitiyServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(builder =>
{
    builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200");
});




app.MapIdentityApiFilterable<AppUser>(new API.IdentitiyOverrides.IdentityApiEndpointRouteBuilderOptions
{
    ExcludeRegisterPost = false,
    ExcludeLoginPost = false,
    ExcludeRefreshPost = false,
    ExcludeConfirmEmailGet = false,
    ExcludeResendConfirmationEmailPost = true,
    ExcludeForgotPasswordPost = true,
    ExcludeResetPasswordPost = true,
    ExcludeManageGroup = true,
    Exclude2faPost = true,
    ExcludegInfoGet = true,
    ExcludeInfoPost = true,
});

app.UseAuthorization();
app.MapControllers();
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<DataContext>();

//Seeds.SeedProducts(context);
//Seeds.SeedFakeProducts(context);
//Seeds.SeedFakeCategories(context);
app.Run();
