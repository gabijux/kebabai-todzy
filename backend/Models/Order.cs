using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    public class Order
    {
        public int Id { get; set; }

        // FK į naudotoją
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Kada atliktas užsakymas
        public DateTime OrderDate  { get; set; }

        // Bendra užsakymo suma
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount  { get; set; }

        // Pvz.: "Completed", "Cancelled", "Pending"
        [MaxLength(50)]
        public string Status { get; set; } = "Completed";

        // NAUJA: užsakymo eilutės (kebabai + kiekiai)
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
