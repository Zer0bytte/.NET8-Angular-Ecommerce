using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specification
{
    public class ProductIncludeImagesRefSpecification : BaseSpecification<Product>
    {
        public ProductIncludeImagesRefSpecification(int id) : base(p => p.Id == id)
        {
            AddInclude(p => p.Images);
            AddInclude(p => p.Category);
        }

    }
}
