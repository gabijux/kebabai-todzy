using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models;

public class Cart
{
    [Key]
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Optional link to a user (if user is logged in)
    public int? UserId { get; set; }

    public List<CartItem> Items { get; set; } = new List<CartItem>();

    [NotMapped]
    public int ItemCount => Items?.Sum(i => i.Quantity) ?? 0;
}
