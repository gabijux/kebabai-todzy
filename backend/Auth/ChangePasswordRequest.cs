namespace BackendApi.Auth;

public record ChangePasswordRequest(
    string Email,
    string OldPassword,
    string NewPassword,
    string ConfirmPassword
);
