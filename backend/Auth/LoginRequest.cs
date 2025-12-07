namespace BackendApi.Auth;

public record LoginRequest(
    string Email,
    string Password
);
