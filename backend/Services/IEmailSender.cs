namespace BackendApi.Services;

public interface IEmailSender
{
    Task<bool> SendPasswordChangedEmailAsync(string toEmail, string firstName);
}
