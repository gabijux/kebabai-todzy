using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models;

public class OrderItem
{
    [Key]
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public int KebabasId { get; set; }
    public Kebabas? Kebabas { get; set; }

    public int Quantity { get; set; }
}
