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
            CreateMap<Product, ProductDto>()
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Category.Name))
                .ReverseMap();
            CreateMap<OrderDto, Order>().ReverseMap();

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>().ReverseMap();
            CreateMap<AddressDto, Core.Entities.Address>().ReverseMap();


            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));

            CreateMap<Product, CartItemDto>()
                .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.Images[0].ImageUrl)).
                ForMember(d => d.Category, o => o.MapFrom(s => s.Category.Name));




            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl));
        }
    }
}
