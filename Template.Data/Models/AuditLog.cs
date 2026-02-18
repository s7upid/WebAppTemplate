namespace Template.Data.Models;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? UserId { get; set; }

    public User? User { get; set; }

    public AuditEventType EventType { get; set; }

    public string Description { get; set; } = null!;

    public string? UserAgent { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public bool Success { get; set; } = true;

    public string? ErrorMessage { get; set; }
    public string? PreChangeValue { get; set; }

    public string? PostChangeValue { get; set; }
}
