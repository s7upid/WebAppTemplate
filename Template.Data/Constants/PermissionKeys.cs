namespace Template.Data.Constants;

/// <summary>
/// Centralized permission key constants.
/// This is the SINGLE SOURCE OF TRUTH for all permission keys.
/// 
/// Usage:
/// - Backend: [Authorize(Policy = PermissionKeys.Users.View)]
/// - Frontend: Generated via script to TypeScript
/// </summary>
public static class PermissionKeys
{
    public static class Dashboard
    {
        public const string View = "dashboard:view";
    }

    public static class Users
    {
        public const string View = "users:view";
        public const string Create = "users:create";
        public const string Edit = "users:edit";
        public const string Delete = "users:delete";
        public const string AssignRole = "users:assign-role";
        public const string Approve = "users:approve";
    }

    public static class Roles
    {
        public const string View = "roles:view";
        public const string Create = "roles:create";
        public const string Edit = "roles:edit";
        public const string Delete = "roles:delete";
    }

    public static class Permissions
    {
        public const string View = "permissions:view";
        public const string Assign = "permissions:assign";
    }

    public static class Settings
    {
        public const string View = "settings:view";
        public const string Edit = "settings:edit";
    }

    public static class Reports
    {
        public const string View = "reports:view";
        public const string Export = "reports:export";
    }

    /// <summary>
    /// Gets all permission keys as a flat list.
    /// Useful for validation and seeding.
    /// </summary>
    public static IReadOnlyList<string> All => new[]
    {
        Dashboard.View,
        Users.View, Users.Create, Users.Edit, Users.Delete, Users.AssignRole, Users.Approve,
        Roles.View, Roles.Create, Roles.Edit, Roles.Delete,
        Permissions.View, Permissions.Assign,
        Settings.View, Settings.Edit,
        Reports.View, Reports.Export,
    };
}

/// <summary>
/// Default role names used in the system.
/// </summary>
public static class RoleNames
{
    public const string Administrator = "administrator";
    public const string Support = "support";
    public const string Regulator = "regulator";
    public const string Operator = "operator";
}
