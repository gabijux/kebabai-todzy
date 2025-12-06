using BackendApi.Auth;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

    
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Esamas pavyzdinis endpointas
app.MapGet("/api/hello", () =>
    Results.Ok(new { message = "Hello from .NET API" }));

// --- Naudotojo registracija ---
// Atliepia PA „Registruotis“ sekų diagramą iš ataskaitos 
app.MapPost("/api/auth/register", async (RegisterUserRequest request, AppDbContext db) =>
{
    var errors = new List<string>();

    if (string.IsNullOrWhiteSpace(request.FirstName))
        errors.Add("Vardas yra privalomas.");

    if (string.IsNullOrWhiteSpace(request.LastName))
        errors.Add("Pavardė yra privaloma.");

    if (string.IsNullOrWhiteSpace(request.Email))
        errors.Add("El. paštas yra privalomas.");

    if (string.IsNullOrWhiteSpace(request.Password))
        errors.Add("Slaptažodis yra privalomas.");

    if (!string.Equals(request.Password, request.ConfirmPassword))
        errors.Add("Slaptažodžiai nesutampa.");

    if (!string.IsNullOrEmpty(request.Password) && request.Password.Length < 8)
        errors.Add("Slaptažodis turi būti bent 8 simbolių.");

    if (!string.IsNullOrWhiteSpace(request.Email) &&
        !request.Email.Contains("@"))
    {
        errors.Add("Neteisingas el. pašto formatas.");
    }

    if (errors.Count > 0)
    {
        return Results.BadRequest(new { errors });
    }

    var normalizedEmail = request.Email.Trim().ToLowerInvariant();

    var exists = await db.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
    if (exists)
    {
        return Results.BadRequest(new
        {
            errors = new[] { "Naudotojas su tokiu el. paštu jau egzistuoja." }
        });
    }

    var user = new User
    {
        FirstName = request.FirstName.Trim(),
        LastName = request.LastName.Trim(),
        Email = normalizedEmail,
        PasswordHash = PasswordHelper.HashPassword(request.Password),
        PhoneNumber = request.PhoneNumber?.Trim(),
        Address = request.Address?.Trim(),
        Role = UserRole.Customer,
        CreatedAt = DateTime.UtcNow
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    var response = UserResponse.FromEntity(user);

    // 201 Created – frontendas po to gali nukreipti į pagrindinį langą
    return Results.Created($"/api/users/{user.Id}", response);
});

// Root
app.MapGet("/", () => Results.Redirect("/api/hello"));

app.Run();
