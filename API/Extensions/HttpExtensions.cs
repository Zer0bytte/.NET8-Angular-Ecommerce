using Core.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
        {
            var jsonOptions = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(header, jsonOptions));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
