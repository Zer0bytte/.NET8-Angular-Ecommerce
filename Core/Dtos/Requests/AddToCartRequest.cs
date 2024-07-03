using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Dtos.Requests
{
    public class AddToCartRequest
    {
        public int ProductId { get; set; }
        public string CartId { get; set; }
    }
}
