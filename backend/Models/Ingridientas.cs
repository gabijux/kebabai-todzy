using System;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public enum Category
    {
        Fruit = 0,
        Vegetable = 1,
        Grain = 2,
        Other = 3,
        Dairy = 4
    }
    public class Ingridientas
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = default!;

        public Category Category { get; set; } = Category.Other;

        public double Amount { get; set; }
        public double Price { get; set; }
        public DateTime OutOfDate { get; set; }
    }
}