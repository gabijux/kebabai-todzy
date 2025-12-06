namespace BackendApi.Models;

public enum UserRole
{
    Customer = 0,
    Admin = 1
}

public class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = default!;  // Vardas
    public string LastName { get; set; } = default!;   // Pavardė

    public string Email { get; set; } = default!;      // El. paštas (unikalus)
    public string PasswordHash { get; set; } = default!;

    public string? PhoneNumber { get; set; }           // Telefono nr. (nebūtinas)
    public string? Address { get; set; }               // Adresas (nebūtinas)

    public UserRole Role { get; set; } = UserRole.Customer;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
