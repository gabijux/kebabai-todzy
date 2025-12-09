using System.Collections.Generic;

namespace BackendApi.Models
{
    public class ReplaceCartItem
    {
        public int KebabasId { get; set; }
        public int Quantity { get; set; }
    }

    public class ReplaceCartRequest
    {
        public int UserId { get; set; }
        public List<ReplaceCartItem> Items { get; set; } = new List<ReplaceCartItem>();
    }
}
