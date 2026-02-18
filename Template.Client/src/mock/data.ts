import {
  RoleResponse,
  PermissionResponse,
  UserResponse,
  Permission,
  UserStatus,
} from "@/models";
import { PERMISSION_KEYS, ROLE_NAMES } from "@/config/generated/permissionKeys.generated";

export const mockRoles: RoleResponse[] = [
  {
    id: "1",
    name: ROLE_NAMES.ADMINISTRATOR,
    description: "Full system access with all permissions",
    permissions: [],
    isSystem: true,
    users: [],
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "2",
    name: ROLE_NAMES.SUPPORT,
    description: "Customer support access with user assistance and reporting",
    permissions: [],
    isSystem: true,
    users: [],
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "3",
    name: ROLE_NAMES.REGULATOR,
    description: "Regulatory oversight with audit and compliance access",
    permissions: [],
    isSystem: true,
    users: [],
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "4",
    name: ROLE_NAMES.OPERATOR,
    description: "Operational access with limited user management",
    permissions: [],
    isSystem: false,
    users: [],
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
];

const toTitleCase = (text: string) =>
  text
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const sectionToCategory: Record<string, string> = {
  DASHBOARD: "General",
  USERS: "User Management",
  ROLES: "Roles",
  PERMISSIONS: "Permissions",
  SETTINGS: "Settings",
  REPORTS: "Reports",
};

const flattenPermissionKeys = (): string[] => {
  const keys: string[] = [];
  for (const section of Object.keys(PERMISSION_KEYS) as Array<
    keyof typeof PERMISSION_KEYS
  >) {
    const entries = PERMISSION_KEYS[section];
    for (const k of Object.keys(entries) as Array<keyof typeof entries>) {
      keys.push(entries[k]);
    }
  }
  return keys;
};

export const mockPermissions: PermissionResponse[] =
  flattenPermissionKeys().map((key, index) => {
    const [resource, action] = key.split(":");

    let category = "General";
    for (const section of Object.keys(PERMISSION_KEYS) as Array<
      keyof typeof PERMISSION_KEYS
    >) {
      const values = Object.values(PERMISSION_KEYS[section]);
      if (values.includes(key as any)) {
        category = sectionToCategory[section] || section;
        break;
      }
    }

    const actionTitle = toTitleCase(action);
    const resourceTitle = toTitleCase(resource);
    const description = `${actionTitle} ${resourceTitle}`.trim();

    return {
      id: String(index + 1),
      key,
      name: key,
      description,
      resource,
      action,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      isSystem: true,
      category,
    } as PermissionResponse;
  });

const sampleAvatars = {
  admin:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  john: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  jane: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77bgAAAABJRU5ErkJggg==",
  bob: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  alice:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
};

export const mockUsers: UserResponse[] = [
  {
    id: "1",
    email: "admin@admin.com",
    firstName: "Admin",
    lastName: "User",
    customPermissionsCount: 0,
    isActive: true,
    userStatus: UserStatus.Active,
    lastLogin: new Date("2024-01-15T10:30:00Z"),
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    avatar: sampleAvatars.admin,
    permissionKeys: [],
    permissions: [],
    role: { name: ROLE_NAMES.ADMINISTRATOR } as RoleResponse,
  },
  {
    id: "2",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    customPermissionsCount: 0,
    isActive: true,
    userStatus: UserStatus.Active,
    lastLogin: new Date("2024-01-14T15:45:00Z"),
    createdAt: new Date("2024-01-02T00:00:00Z"),
    updatedAt: new Date("2024-01-02T00:00:00Z"),
    avatar: sampleAvatars.john,
    permissionKeys: [],
    permissions: [],
    role: { name: ROLE_NAMES.SUPPORT } as RoleResponse,
  },
  {
    id: "3",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    customPermissionsCount: 0,
    isActive: true,
    userStatus: UserStatus.Active,
    lastLogin: new Date("2024-01-13T09:20:00Z"),
    createdAt: new Date("2024-01-03T00:00:00Z"),
    updatedAt: new Date("2024-01-03T00:00:00Z"),
    avatar: sampleAvatars.jane,
    permissionKeys: [],
    permissions: [],
    role: { name: ROLE_NAMES.REGULATOR } as RoleResponse,
  },
  {
    id: "4",
    email: "bob.wilson@example.com",
    firstName: "Bob",
    lastName: "Wilson",
    customPermissionsCount: 0,
    isActive: false,
    userStatus: UserStatus.Inactive,
    createdAt: new Date("2024-01-04T00:00:00Z"),
    updatedAt: new Date("2024-01-04T00:00:00Z"),
    avatar: sampleAvatars.bob,
    permissionKeys: [],
    lastLogin: new Date("2024-01-13T09:20:00Z"),
    permissions: [],
    role: { name: ROLE_NAMES.OPERATOR } as RoleResponse,
  },
  {
    id: "5",
    email: "alice.johnson@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    customPermissionsCount: 0,
    isActive: true,
    userStatus: UserStatus.Pending,
    createdAt: new Date("2024-01-05T00:00:00Z"),
    updatedAt: new Date("2024-01-05T00:00:00Z"),
    avatar: sampleAvatars.alice,
    permissionKeys: [],
    lastLogin: new Date("2024-01-13T09:20:00Z"),
    permissions: [],
    role: { name: ROLE_NAMES.OPERATOR } as RoleResponse,
  },

  ...Array.from({ length: 100 }).map((_, idx) => {
    const i = idx + 6;
    const roleNames = [ROLE_NAMES.ADMINISTRATOR, ROLE_NAMES.SUPPORT, ROLE_NAMES.REGULATOR, ROLE_NAMES.OPERATOR];
    const roleName = roleNames[idx % roleNames.length];
    const statuses = [
      UserStatus.Active,
      UserStatus.Inactive,
      UserStatus.Pending,
    ] as const;
    const status = statuses[idx % statuses.length];
    return {
      id: String(i),
      email: `user${i}@example.com`,
      firstName: `User${i}`,
      lastName: `Test${i}`,
      customPermissionsCount: 0,
      isActive: status === UserStatus.Active,
      userStatus: UserStatus.Active,
      status,
      lastLogin: new Date("2024-02-01T10:00:00Z"),
      createdAt: new Date(2024, 1, (idx % 28) + 1),
      updatedAt: new Date(2024, 1, (idx % 28) + 1),
      permissionKeys: [],
      avatar: sampleAvatars.alice,
      permissions: [],
      role: { name: roleName } as RoleResponse,
    } as UserResponse;
  }),
];

const getPermissionByKey = (key: string): Permission => {
  const perm = mockPermissions.find((p) => p.key === key);
  if (!perm) {
    throw new Error(`Missing mock permission for key: ${key}`);
  }
  return perm;
};

(() => {
  mockRoles[0].permissions = [...mockPermissions];

  mockRoles[1].permissions = [
    getPermissionByKey(PERMISSION_KEYS.DASHBOARD.VIEW),
    getPermissionByKey(PERMISSION_KEYS.USERS.VIEW),
    getPermissionByKey(PERMISSION_KEYS.USERS.EDIT),
    getPermissionByKey(PERMISSION_KEYS.REPORTS.VIEW),
    getPermissionByKey(PERMISSION_KEYS.USERS.APPROVE),
  ];

  mockRoles[2].permissions = [
    getPermissionByKey(PERMISSION_KEYS.DASHBOARD.VIEW),
    getPermissionByKey(PERMISSION_KEYS.REPORTS.VIEW),
    getPermissionByKey(PERMISSION_KEYS.REPORTS.EXPORT),
    getPermissionByKey(PERMISSION_KEYS.PERMISSIONS.VIEW),
  ];

  mockRoles[3].permissions = [
    getPermissionByKey(PERMISSION_KEYS.DASHBOARD.VIEW),
    getPermissionByKey(PERMISSION_KEYS.USERS.VIEW),
  ];
})();

export const mockUserDetails: UserResponse[] = mockUsers.map((user, index) => {
  const roleIndex = index % mockRoles.length;
  const role = mockRoles[roleIndex];

  return {
    ...user,
    role,
    permissions: role.permissions || [],
    permissionKeys: role.permissions?.map((p) => p.key) || [],
  } as UserResponse;
});

export const mockPasswords: Record<string, string> = {
  "admin@admin.com": "admin123",
  "john.doe@example.com": "password123",
  "jane.smith@example.com": "password123",
  "bob.wilson@example.com": "password123",
  "alice.johnson@example.com": "password123",
};

export const dashboardAdministratorStats = {
  totalUsers: 1247,
  activeUsers: 892,
  pendingUsers: 23,
  totalRoles: 4,
  systemHealth: 99.8,
  totalPermissions: 45,
  recentLogins: 156,
  systemUptime: 99.9,
  recentActivity: [
    {
      id: "1",
      type: "login",
      description: "User logged in",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "create",
      description: "New user created",
      timestamp: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      type: "update",
      description: "Role updated",
      timestamp: "2024-01-15T08:45:00Z",
    },
  ],
};

export const dashboardSupportStats = {
  totalUsers: 1247,
  activeUsers: 892,
  newUsersThisWeek: 45,
  totalRoles: 4,
  userGrowth: 12.5,
  pendingApprovals: 8,
  supportTickets: 23,
  resolvedTickets: 156,
  totalPermissions: 45,
  recentActivity: [
    {
      id: "1",
      type: "ticket",
      description: "Support ticket resolved",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "approval",
      description: "User approval processed",
      timestamp: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      type: "support",
      description: "New support ticket",
      timestamp: "2024-01-15T08:45:00Z",
    },
  ],
};

export const dashboardRegulatorStats = {
  totalUsers: 1247,
  activeUsers: 892,
  complianceScore: 94.5,
  auditReports: 12,
  violations: 3,
  resolvedViolations: 28,
  totalRoles: 4,
  totalPermissions: 45,
  recentActivity: [
    {
      id: "1",
      type: "audit",
      description: "Audit report generated",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "violation",
      description: "Violation resolved",
      timestamp: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      type: "compliance",
      description: "Compliance check completed",
      timestamp: "2024-01-15T08:45:00Z",
    },
  ],
};

export const dashboardOperatorStats = {
  tasksAssigned: 15,
  tasksCompleted: 12,
  tasksPending: 3,
  productivityScore: 85,
  upcomingDeadlines: 2,
  achievements: 5,
  systemOperations: 8,
  reportsGenerated: 12,
  totalUsers: 1247,
  totalRoles: 4,
  totalPermissions: 45,
  recentActivity: [
    {
      id: "1",
      type: "task",
      description: "Task completed",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "operation",
      description: "System operation executed",
      timestamp: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      type: "report",
      description: "Report generated",
      timestamp: "2024-01-15T08:45:00Z",
    },
  ],
};
