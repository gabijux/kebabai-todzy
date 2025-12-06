namespace BackendApi.Auth;

public record RegisterUserRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string ConfirmPassword,
    string? PhoneNumber,
    string? Address
);
