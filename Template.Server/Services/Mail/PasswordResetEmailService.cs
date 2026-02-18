namespace Template.Server.Services.Mail;

public static class PasswordResetEmailService
{
    public static string GenerateHtml(string firstName, string lastName, string resetLink) => $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><title>Password Reset</title></head>
<body>
<h2>Hello {firstName} {lastName}!</h2>
<p>Reset your password <a href='{resetLink}'>here</a>.</p>
<p>This link expires in 24 hours.</p>
</body>
</html>";

    public static string GeneratePlainText(string firstName, string lastName, string resetLink) => $@"
Hello {firstName} {lastName}!
Reset your password using this link: {resetLink}
This link expires in 24 hours.";

    internal static string ConfirmationHtml(string firstName, string lastName, string link)
    {
        return $@"<!DOCTYPE html>
<html>
<head><meta charset='utf-8'><title>Email Confirmation</title></head>
<body>
<h2>Welcome {firstName} {lastName}!</h2>
<p>Thank you for joining our platform. Please confirm your email address by clicking the link below:</p>
<p><a href='{link}'>Confirm Email Address</a></p>
<p>After confirming your email, you can set your password and start using your account.</p>
<p>This link expires in 24 hours.</p>
<p>If you didn't create an account, please ignore this email.</p>
</body>
</html>";
    }

    internal static string? ConfirmationPlainText(string firstName, string lastName, string link)
    {
        return $@"Welcome {firstName} {lastName}!

Thank you for joining our platform. Please confirm your email address by visiting the link below:

{link}

After confirming your email, you can set your password and start using your account.

This link expires in 24 hours.

If you didn't create an account, please ignore this email.";
    }
}
