namespace BackendApi.Auth;

public record LoginResponse(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    int OrdersCount
);
