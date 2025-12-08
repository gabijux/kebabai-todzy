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
        user.Role.ToString(),
        user.OrdersCount
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

// --- Kebabinių sąrašas ---
app.MapGet("/api/kebabines", async (AppDbContext db) =>
{
    return await db.Kebabines.ToListAsync();
});

app.MapGet("/api/kebabines/{id:int}", async (int id, AppDbContext db) =>
{
    var kebabine = await db.Kebabines.FindAsync(id);
    return kebabine is not null ? Results.Ok(kebabine) : Results.NotFound();
});

app.MapPost("/api/kebabines", async (Kebabine kebabine, AppDbContext db) =>
{
    db.Kebabines.Add(kebabine);
    await db.SaveChangesAsync();
    return Results.Created($"/api/kebabines/{kebabine.Id}", kebabine);
});

app.MapPut("/api/kebabines/{id:int}", async (int id, Kebabine inputKebabine, AppDbContext db) =>
{
    var kebabine = await db.Kebabines.FindAsync(id);
    if (kebabine is null) return Results.NotFound();

    kebabine.Name = inputKebabine.Name;
    kebabine.Address = inputKebabine.Address;
    kebabine.PhoneNumber = inputKebabine.PhoneNumber;
    kebabine.Email = inputKebabine.Email;
    kebabine.Rating = inputKebabine.Rating;
    kebabine.OpeningHours = inputKebabine.OpeningHours;
    kebabine.City = inputKebabine.City;
    kebabine.EmployeeCount = inputKebabine.EmployeeCount;
    kebabine.XCoordinate = inputKebabine.XCoordinate;
    kebabine.YCoordinate = inputKebabine.YCoordinate;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/kebabines/{id:int}", async (int id, AppDbContext db) =>
{
    var kebabine = await db.Kebabines.FindAsync(id);
    if (kebabine is null) return Results.NotFound();

    db.Kebabines.Remove(kebabine);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Kebabinė ištrinta" });
});

app.MapGet("/", () => Results.Redirect("/api/hello"));

// --- Kebabų sąrašas ---
app.MapGet("/api/kebabas", async (AppDbContext db) =>
{
    return await db.Kebabas.ToListAsync();
});

app.MapGet("/api/kebabas/{id:int}", async (int id, AppDbContext db) =>
{
    var kebab = await db.Kebabas
        .Include(k => k.Ingridientas)
        .FirstOrDefaultAsync(k => k.Id == id);

    if (kebab == null) return Results.NotFound();

    return Results.Ok(new
    {
        kebab.Id,
        kebab.Name,
        kebab.Size,
        kebab.Price,
        kebab.Category,
        kebab.Sauce,
        kebab.Calories,
        kebab.Proteins,
        kebab.Fats,
        kebab.Carbohydrates,
        kebab.Spicy,
        kebab.Description,
        Ingredients = kebab.Ingridientas.Select(i => new { i.Id, i.Name, i.Category, i.Amount, i.Price })
    });
});

app.MapDelete("/api/kebabas/{id:int}", async (int id, AppDbContext db) =>
{
    var kebab = await db.Kebabas.FindAsync(id);
    if (kebab == null) return Results.NotFound();

    db.Kebabas.Remove(kebab);
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Kebabas ištrintas" });
});

app.MapPut("/api/kebabas/{id:int}", async (int id, Kebabas updatedKebab, AppDbContext db) =>
{
    var kebab = await db.Kebabas.FindAsync(id);
    if (kebab == null) return Results.NotFound();

    kebab.Name = updatedKebab.Name;
    kebab.Size = updatedKebab.Size;
    kebab.Price = updatedKebab.Price;
    kebab.Category = updatedKebab.Category;
    kebab.Sauce = updatedKebab.Sauce;
    kebab.Calories = updatedKebab.Calories;
    kebab.Proteins = updatedKebab.Proteins;
    kebab.Fats = updatedKebab.Fats;
    kebab.Carbohydrates = updatedKebab.Carbohydrates;
    kebab.Spicy = updatedKebab.Spicy;
    kebab.Description = updatedKebab.Description;

    if (updatedKebab.Ingridientas != null)
    {
        // Clear current ingredients
        kebab.Ingridientas.Clear();

        // Attach new ingredients
        foreach (var ing in updatedKebab.Ingridientas)
        {
            var ingredient = await db.Ingridientas.FindAsync(ing.Id);
            if (ingredient != null)
                kebab.Ingridientas.Add(ingredient);
        }
    }

    await db.SaveChangesAsync();
    return Results.Ok(new
    {
        kebab.Id,
        kebab.Name,
        kebab.Size,
        kebab.Price,
        kebab.Category,
        kebab.Sauce,
        kebab.Calories,
        kebab.Proteins,
        kebab.Fats,
        kebab.Carbohydrates,
        kebab.Spicy,
        kebab.Description,
        Ingredients = kebab.Ingridientas.Select(i => new { i.Id, i.Name, i.Category, i.Amount, i.Price })
    });
});

app.MapPost("/api/kebabas", async (Kebabas newKebab, AppDbContext db) =>
{
    var ingredients = new List<Ingridientas>();
    if (newKebab.Ingridientas != null)
    {
        foreach (var ing in newKebab.Ingridientas)
        {
            var ingredient = await db.Ingridientas.FindAsync(ing.Id);
            if (ingredient != null)
                ingredients.Add(ingredient);
        }
        newKebab.Ingridientas = ingredients;
    }
    db.Kebabas.Add(newKebab);
    await db.SaveChangesAsync();
    return Results.Created($"/api/kebabas/{newKebab.Id}", new
    {
        newKebab.Id,
        newKebab.Name,
        newKebab.Size,
        newKebab.Price,
        newKebab.Category,
        newKebab.Sauce,
        newKebab.Calories,
        newKebab.Proteins,
        newKebab.Fats,
        newKebab.Carbohydrates,
        newKebab.Spicy,
        newKebab.Description,
        Ingredients = newKebab.Ingridientas.Select(i => new { i.Id, i.Name, i.Category, i.Amount, i.Price })
    });
});

app.MapPost("/api/discounts/generate", async (GenerateDiscountRequest request, AppDbContext db, IEmailSender emailSender) =>
{
    var user = await db.Users.FindAsync(request.UserId);
    if (user is null) return Results.NotFound(new { error = "Naudotojas nerastas." });

    if (user.OrdersCount < 5)
    {
        return Results.BadRequest(new { error = "Nuolaidos kodo generuoti galima tik po 5 užsakymų." });
    }

    var code = "DISCOUNT-" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();

    var emailSent = await emailSender.SendDiscountCodeEmailAsync(user.Email, user.FirstName, code);

    if (!emailSent)
    {
        return Results.BadRequest(new { error = "Nepavyko išsiųsti nuolaidos kodo el. paštu." });
    }

    await db.SaveChangesAsync();

    return Results.Ok(new { code, message = "Nuolaidos kodas sugeneruotas ir išsiųstas į jūsų el. paštą." });
});

app.MapGet("/api/ingredients", async (AppDbContext db) => await db.Ingridientas.ToListAsync());

app.Run();
