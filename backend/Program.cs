using BackendApi.Auth;
using BackendApi.Data;
using BackendApi.Models;
using BackendApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql
(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();
    
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

app.MapPost("/api/auth/login", async (LoginRequest request, AppDbContext db) =>
{
    var emailNorm = request.Email.Trim().ToLowerInvariant();

    // 1. Patikrinam ar naudotojas egzistuoja
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == emailNorm);

    if (user is null)
    {
        return Results.BadRequest(new
        {
            errors = new[] { "Naudotojas su tokiu el. paštu nerastas." }
        });
    }

    // 2. Tikrinam slaptažodį
    bool validPassword = PasswordHelper.VerifyPassword(request.Password, user.PasswordHash);

    if (!validPassword)
    {
        return Results.BadRequest(new
        {
            errors = new[] { "Neteisingas slaptažodis." }
        });
    }

    // 3. Sukuriam minimalų login sėkmės atsakymą
    var response = new LoginResponse(
        user.Id,
        user.FirstName,
        user.LastName,
        user.Email,
        user.Role.ToString()
    );

    return Results.Ok(response);
});



app.MapPut("/api/users/edit", async (EditUserRequest request, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(request.Id);

    if (user is null)
    {
        return Results.NotFound(new { errors = new[] { "Naudotojas nerastas." } });
    }

    // Validacija (paprasta, vėliau galim praplėsti)
    if (string.IsNullOrWhiteSpace(request.FirstName) ||
        string.IsNullOrWhiteSpace(request.LastName) ||
        string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { errors = new[] { "Visi privalomi laukai turi būti užpildyti." } });
    }

    // Atnaujinam duomenis
    user.FirstName = request.FirstName.Trim();
    user.LastName = request.LastName.Trim();
    user.Email = request.Email.Trim().ToLowerInvariant();
    user.PhoneNumber = request.PhoneNumber?.Trim();
    user.Address = request.Address?.Trim();

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Paskyra sėkmingai atnaujinta!",
        user = new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.PhoneNumber,
            user.Address,
            user.Role
        }
    });
});

app.MapPost("/api/users/delete", async (LoginRequest request, AppDbContext db) =>
{
    var emailNorm = request.Email.Trim().ToLowerInvariant();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == emailNorm);

    if (user is null)
    {
        return Results.BadRequest(new { errors = new[] { "Naudotojas nerastas." } });
    }

    bool validPassword = PasswordHelper.VerifyPassword(request.Password, user.PasswordHash);

    if (!validPassword)
    {
        return Results.BadRequest(new { errors = new[] { "Neteisingas slaptažodis." } });
    }

    db.Users.Remove(user);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Paskyra sėkmingai ištrinta." });
});

app.MapGet("/api/orders/user/{userId:int}", async (int userId, AppDbContext db) =>
{
    var orders = await db.Orders
        .Where(o => o.UserId == userId)
        .OrderByDescending(o => o.OrderDate)
        .Select(o => new
        {
            o.Id,
            o.OrderDate,
            o.Amount,
            o.Status
        })
        .ToListAsync();

    return Results.Ok(orders);
});



app.MapGet("/api/orders/{id:int}", async (int id, AppDbContext db) =>
{
    var order = await db.Orders.FindAsync(id);

    if (order is null)
    {
        return Results.NotFound(new { error = "Užsakymas nerastas." });
    }

    return Results.Ok(new
    {
        order.Id,
        order.UserId,
        order.OrderDate,
        order.Amount,
        order.Status
    });
});


app.MapPost("/api/auth/change-password", async (
    ChangePasswordRequest request,
    AppDbContext db,
    IEmailSender emailSender) =>
{
    var errors = new List<string>();

    if (string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.OldPassword) ||
        string.IsNullOrWhiteSpace(request.NewPassword) ||
        string.IsNullOrWhiteSpace(request.ConfirmPassword))
    {
        errors.Add("Visi laukai privalomi.");
    }

    if (request.NewPassword != request.ConfirmPassword)
    {
        errors.Add("Naujas slaptažodis ir pakartotas slaptažodis nesutampa.");
    }

    if (request.NewPassword.Length < 6)
    {
        errors.Add("Naujas slaptažodis turi būti bent 6 simbolių.");
    }

    if (errors.Count > 0)
    {
        return Results.BadRequest(new { errors });
    }

    var emailNorm = request.Email.Trim().ToLowerInvariant();

    var user = await db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == emailNorm);
    if (user is null)
    {
        return Results.BadRequest(new { errors = new[] { "Naudotojas su tokiu el. paštu nerastas." } });
    }

    // Patikrinam seną slaptažodį
    var oldOk = PasswordHelper.VerifyPassword(request.OldPassword, user.PasswordHash);
    if (!oldOk)
    {
      return Results.BadRequest(new { errors = new[] { "Neteisingas senas slaptažodis." } });
    }

    // --- Sekų diagrama: siuntimas į el. pašto serverį ---
    var emailOk = await emailSender.SendPasswordChangedEmailAsync(user.Email, user.FirstName);

    if (!emailOk)
    {
        // El. pašto serveris gražina "nepavyko" → klaidos pranešimas
        return Results.BadRequest(new { errors = new[] { "Nepavyko išsiųsti patvirtinimo laiško." } });
    }

    // Jei laiškas išsiųstas – keičiam slaptažodį DB
    user.PasswordHash = PasswordHelper.HashPassword(request.NewPassword);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Slaptažodis sėkmingai pakeistas. Patvirtinimo laiškas išsiųstas į jūsų el. paštą."
    });
});


app.MapGet("/", () => Results.Redirect("/api/hello"));

app.Run();
