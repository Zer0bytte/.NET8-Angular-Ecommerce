using AutoMapper;
using Core.Dtos;
using Core.Dtos.Requests;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.MappingProfiles
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CartItem, CartItemDto>().ReverseMap();
            CreateMap<OrderDto, Order>().ReverseMap();
            CreateMap<AddressDto, Address>().ReverseMap();


            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShoppingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));


            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl));
        }
    }
}
