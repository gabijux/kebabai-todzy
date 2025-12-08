namespace BackendApi.Services;

public interface IEmailSender
{
    Task<bool> SendPasswordChangedEmailAsync(string toEmail, string firstName);
    Task<bool> SendDiscountCodeEmailAsync(string toEmail, string firstName, string code);
}
