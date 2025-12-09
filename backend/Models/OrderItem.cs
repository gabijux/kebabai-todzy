namespace BackendApi.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        // FK į Order
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        // FK į Kebabas
        public int KebabasId { get; set; }
        public Kebabas Kebabas { get; set; } = null!;

        // Kiek kiekvieno kebabo
        public int Quantity { get; set; }
    }
}
