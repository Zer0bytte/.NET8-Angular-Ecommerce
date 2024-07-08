using Core.Entities.OrderAggregate;
using System.Net.NetworkInformation;

namespace Core.Dtos.Requests
{
    public class OrderDto
    {
        public string BasketId { get; set; }
        public int DeliveryMethodId { get; set; }
        public AddressDto ShipToAddress { get; set; }

    }
}
