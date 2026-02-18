namespace Template.Server.Services.Mail.Interfaces;

public interface IEmailService
{
    Task SendAsync(string toEmail, string subject, string htmlBody, string? plainTextBody = null);
}
