﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Dtos.Requests
{
    public class SetCartDeliveryMethodDto
    {
        public string CartId { get; set; }
        public int DeliveryMethodId { get; set; }
    }
}
