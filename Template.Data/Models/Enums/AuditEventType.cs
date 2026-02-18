namespace Template.Data.Models.Enums;

public enum AuditEventType
{
    Login,
    Logout,
    TokenRefresh,
    PasswordChange,
    PasswordReset,
    PasswordResetRequested,
    PasswordResetCompleted,
    EmailConfirmed,
    EmailConfirmationResent,
    AccountLocked,
    AccountUnlocked,
    PermissionChanged,
    RoleChanged,
    FailedLogin,
    TokenBlacklisted,
    Created,
    Updated,
    Deleted
}
