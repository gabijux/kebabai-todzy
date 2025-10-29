using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/api/hello", () => Results.Ok(new { message = "Hello from .NET API" }));

app.MapGet("/", () => Results.Redirect("/api/hello"));

app.Run();
