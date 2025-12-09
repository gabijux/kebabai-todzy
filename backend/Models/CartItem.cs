using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }

    public int CartId { get; set; }
    public Cart? Cart { get; set; }

    // Reference to Kebabas
    public int KebabasId { get; set; }
    public Kebabas? Kebabas { get; set; }

    public int Quantity { get; set; } = 1;
}
