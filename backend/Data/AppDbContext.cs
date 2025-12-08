using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Kebabine> Kebabines => Set<Kebabine>();
    public DbSet<Kebabas> Kebabas => Set<Kebabas>();
    public DbSet<Ingridientas> Ingridientas => Set<Ingridientas>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Kebabine>().HasData(
            new Kebabine
            {
                Id = 1,
                Name = "Jammi Kebabai",
                Address = "Vilniaus g. 10",
                City = "Vilnius",
                PhoneNumber = "+37060000001",
                Email = "info@jammi.lt",
                Rating = 4.5,
                OpeningHours = "10:00 - 22:00",
                EmployeeCount = 5,
                XCoordinate = 54.6872,
                YCoordinate = 25.2797
            },
            new Kebabine
            {
                Id = 2,
                Name = "Kebab Inn",
                Address = "Kauno g. 5",
                City = "Kaunas",
                PhoneNumber = "+37060000002",
                Email = "info@kebabinn.lt",
                Rating = 4.2,
                OpeningHours = "11:00 - 23:00",
                EmployeeCount = 3,
                XCoordinate = 54.8985,
                YCoordinate = 23.9036
            },
            new Kebabine
            {
                Id = 3,
                Name = "Liuks Kebabai",
                Address = "Taikos pr. 15",
                City = "Klaipėda",
                PhoneNumber = "+37060000003",
                Email = "info@liuks.lt",
                Rating = 4.8,
                OpeningHours = "09:00 - 00:00",
                EmployeeCount = 4,
                XCoordinate = 55.7033,
                YCoordinate = 21.1443
            }
        );
        modelBuilder.Entity<Kebabas>().HasData(
            new Kebabas
            {
                Id = 1,
                Name = "Classic Kebab",
                Size = KebabasSize.Big,
                Price = 5.99,
                Category = "Chicken",
                Sauce = "Garlic",
                Calories = 600,
                Proteins = 30,
                Fats = 20,
                Carbohydrates = 70,
                Spicy = false,
                Description = "A delicious classic chicken kebab with garlic sauce."
            },
            new Kebabas
            {
                Id = 2,
                Name = "Spicy Beef Kebab",
                Size = KebabasSize.Small,
                Price = 6.49,
                Category = "Beef",
                Sauce = "Spicy",
                Calories = 700,
                Proteins = 40,
                Fats = 25,
                Carbohydrates = 60,
                Spicy = true,
                Description = "A fiery beef kebab for those who love spice."
            },
            new Kebabas
            {
                Id = 3,
                Name = "Vegetarian Kebab",
                Size = KebabasSize.Big,
                Price = 5.49,
                Category = "Vegetarian",
                Sauce = "Yogurt",
                Calories = 500,
                Proteins = 15,
                Fats = 10,
                Carbohydrates = 80,
                Spicy = false,
                Description = "A healthy and tasty vegetarian kebab with yogurt sauce."
            }
        );
        modelBuilder.Entity<Ingridientas>().HasData(
            new Ingridientas { Id = 1, Name = "Chicken", Category = Category.Other, Amount = 100, Price = 1.5, OutOfDate = DateTime.UtcNow.AddMonths(6) },
            new Ingridientas { Id = 2, Name = "Beef", Category = Category.Other, Amount = 100, Price = 2, OutOfDate = DateTime.UtcNow.AddMonths(6) },
            new Ingridientas { Id = 3, Name = "Lettuce", Category = Category.Vegetable, Amount = 50, Price = 0.5, OutOfDate = DateTime.UtcNow.AddMonths(2) },
            new Ingridientas { Id = 4, Name = "Tomato", Category = Category.Vegetable, Amount = 50, Price = 0.6, OutOfDate = DateTime.UtcNow.AddMonths(2) }
        );
        modelBuilder.Entity<Kebabas>()
            .HasMany(k => k.Ingridientas)
            .WithMany()
            .UsingEntity(j => j.ToTable("KebabasIngridientas"));
    }
}
