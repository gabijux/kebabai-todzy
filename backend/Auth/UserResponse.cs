using BackendApi.Models;

namespace BackendApi.Auth;

public record UserResponse(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Role,
    int OrdersCount
)
{
    public static UserResponse FromEntity(User user) =>
        new(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role.ToString(),
            user.OrdersCount
        );
}
