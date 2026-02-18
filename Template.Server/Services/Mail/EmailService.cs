namespace Template.Server.Services.Mail;

public class EmailService(ILogger logger, IConfiguration configuration) : IEmailService
{
    private readonly ILogger _logger = logger;
    private readonly IConfiguration _configuration = configuration;

    public async Task SendAsync(string toEmail, string subject, string htmlBody, string? plainTextBody = null)
    {
        try
        {

            _logger.Information("Email would be sent to: {ToEmail}", toEmail);
            _logger.Information("Subject: {Subject}", subject);
            _logger.Information("HTML Body: {HtmlBody}", htmlBody);
            if (!string.IsNullOrEmpty(plainTextBody))
            {
                _logger.Information("Plain Text Body: {PlainTextBody}", plainTextBody);
            }

            /*
            var smtpHost = _configuration["EmailSettings:SmtpHost"];
            var smtpPort = _configuration.GetValue<int>("EmailSettings:SmtpPort");
            var smtpUsername = _configuration["EmailSettings:SmtpUsername"];
            var smtpPassword = _configuration["EmailSettings:SmtpPassword"];
            var fromEmail = _configuration["EmailSettings:FromEmail"];

            using var client = new SmtpClient(smtpHost, smtpPort);
            client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
            client.EnableSsl = true;

            using var message = new MailMessage(fromEmail, toEmail, subject, plainTextBody ?? htmlBody);
            message.IsBodyHtml = !string.IsNullOrEmpty(htmlBody);

            await client.SendMailAsync(message);
            */

            _logger.Information("Email sent successfully to {ToEmail}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.Error(ex, "Failed to send email to {ToEmail}", toEmail);
            throw;
        }
    }
}