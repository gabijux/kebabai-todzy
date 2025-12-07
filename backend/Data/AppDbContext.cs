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
    }
}
