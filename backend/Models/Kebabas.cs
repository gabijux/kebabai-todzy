using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public enum KebabasSize
    {
        Small = 0,
        Big = 1
    }

    public class Kebabas
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = default!;
        public KebabasSize? Size { get; set; } = KebabasSize.Small;
        public double Price { get; set;  }
        public string Category { get; set; } = default!;
        public string Sauce { get; set; } = default!;
        public int Calories { get; set;  }
        public double Proteins { get; set;  }
        public double Fats { get; set;  }
        public double Carbohydrates { get; set;  }
        public bool Spicy { get; set;  }
        public string Description { get; set;  } = default!;

        public ICollection<Ingridientas> Ingridientas { get; set; } = new List<Ingridientas>();

        // NAUJA: užsakymo eilutės, kuriose naudojamas šis kebabas
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
