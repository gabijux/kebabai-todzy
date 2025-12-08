using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace BackendApi.Services;

public class SmtpEmailSender : IEmailSender
{
    private readonly IConfiguration _config;

    public SmtpEmailSender(IConfiguration config)
    {
        _config = config;
    }

    public async Task<bool> SendPasswordChangedEmailAsync(string toEmail, string firstName)
    {
        try
        {
            var section = _config.GetSection("Email");

            var from = section["From"];
            var host = section["SmtpHost"];
            var user = section["User"];
            var pass = section["Password"];
            var portStr = section["SmtpPort"] ?? "587";
            var sslStr = section["EnableSsl"] ?? "true";

            if (string.IsNullOrWhiteSpace(from) ||
                string.IsNullOrWhiteSpace(host) ||
                string.IsNullOrWhiteSpace(user) ||
                string.IsNullOrWhiteSpace(pass))
            {
                return false; // neteisinga konfiguracija
            }

            int port = int.Parse(portStr);
            bool enableSsl = bool.Parse(sslStr);

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                Credentials = new NetworkCredential(user, pass)
            };

            var msg = new MailMessage(from, toEmail);
            msg.Subject = "Jūsų slaptažodis buvo pakeistas";
            msg.Body =
                $"Sveiki, {firstName},\n\n" +
                "Jūsų paskyros slaptažodis buvo pakeistas. " +
                "Jei tai nebuvote jūs, nedelsiant susisiekite su sistemos administracija.\n\n" +
                "Pagarbiai,\nKebabai Todzy sistema";
            msg.IsBodyHtml = false;

            await client.SendMailAsync(msg);
            return true;
        }
        catch
        {
            return false;
        }
    }
    public async Task<bool> SendDiscountCodeEmailAsync(string toEmail, string firstName, string code)
    {
        try
        {
            var section = _config.GetSection("Email");

            var from = section["From"];
            var host = section["SmtpHost"];
            var user = section["User"];
            var pass = section["Password"];
            var portStr = section["SmtpPort"] ?? "587";
            var sslStr = section["EnableSsl"] ?? "true";

            if (string.IsNullOrWhiteSpace(from) ||
                string.IsNullOrWhiteSpace(host) ||
                string.IsNullOrWhiteSpace(user) ||
                string.IsNullOrWhiteSpace(pass))
            {
                return false; // neteisinga konfiguracija
            }

            int port = int.Parse(portStr);
            bool enableSsl = bool.Parse(sslStr);

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                Credentials = new NetworkCredential(user, pass)
            };

            var msg = new MailMessage(from, toEmail);
            msg.Subject = "Jūsų nuolaidos kodas";
            msg.Body =
                $"Sveiki, {firstName},\n\n" +
                $"Jūsų nuolaidos kodas: {code}\n\n" +
                "Panaudokite jį kitam užsakymui.\n\n" +
                "Pagarbiai,\nKebabai Todzy sistema";
            msg.IsBodyHtml = false;

            await client.SendMailAsync(msg);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
