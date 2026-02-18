import React, { useState, useEffect, useMemo, useRef } from "react";
import * as LucideIcons from "lucide-react";
import {
  Palette,
  User,
  Mail,
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Users,
  Shield,
  BarChart3,
  Calendar,
  Key,
  UserIcon,
  XCircle,
  FileText,
  Inbox,
  Grid3X3,
  Menu,
  X,
} from "lucide-react";
import { useToast } from "@/hooks";
import { cn } from "@/utils";
import styles from "./ComponentsReferencePage.module.css";
import {
  ModalPage,
  BasePage,
  GridPage,
  TablePage,
  Button,
  Card,
  ConfirmationDialog,
  FilterSelect,
  Form,
  Input,
  LoadingSpinner,
  ModalPortal,
  PageHeader,
  Pagination,
  SearchInput,
  StatsCard,
  StatusBadge,
  ThemeToggle,
  DangerZone,
  DashboardCard,
  EntityToolbar,
  PermissionGuard,
  ErrorBoundary,
  ActionButtons,
  AuditLogCard,
  AuditLogTimeline,
  AvatarUploader,
  RoleGuard,
  List,
  EmptyState,
  Dropdown,
  TabNavigation,
} from "@/components";
import type { TabItem } from "@/components";
import { PermissionSelector, UserActions } from "@/pages";
import { PERMISSION_KEYS, ROLE_NAMES } from "@/config/generated/permissionKeys.generated";
import { UserStatus, AuditLog, AuditEventType } from "@/models/generated";
import { ActionButton } from "@/models";

// Section definitions for navigation
const SECTIONS = [
  { id: "buttons", label: "Buttons", icon: Plus },
  { id: "cards", label: "Cards", icon: FileText },
  { id: "forms", label: "Form Components", icon: Edit },
  { id: "status", label: "Status & Feedback", icon: AlertCircle },
  { id: "data", label: "Data Display", icon: BarChart3 },
  { id: "modals", label: "Modals & Dialogs", icon: Eye },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "base", label: "Base Components", icon: Settings },
  { id: "user", label: "User Components", icon: User },
  { id: "permissions", label: "Permission Components", icon: Shield },
  { id: "additional", label: "Additional Forms", icon: Mail },
  { id: "actions", label: "Action Buttons", icon: Grid3X3 },
  { id: "audit", label: "Audit Log", icon: Calendar },
  { id: "list", label: "List Component", icon: FileText },
  { id: "empty", label: "Empty State", icon: Inbox },
  { id: "tabs", label: "Tab Navigation", icon: Menu },
  { id: "icons", label: "Icon Gallery", icon: Grid3X3 },
] as const;

// Get all icon names from lucide-react
const getAllIconNames = (): string[] => {
  // Use the icons object if available, otherwise iterate over exports
  const iconsObj = (LucideIcons as any).icons;
  if (iconsObj && typeof iconsObj === "object") {
    return Object.keys(iconsObj).sort();
  }
  
  const iconNames: string[] = [];
  
  for (const key of Object.keys(LucideIcons)) {
    // Skip non-icon exports
    if (
      key === "createLucideIcon" ||
      key === "default" ||
      key === "icons" ||
      key.startsWith("Lucide") ||
      !/^[A-Z]/.test(key)
    ) {
      continue;
    }
    
    const value = (LucideIcons as Record<string, unknown>)[key];
    
    // Check if it's a valid React component (function or forwardRef object)
    if (
      typeof value === "function" ||
      (typeof value === "object" && value !== null && "$$typeof" in value)
    ) {
      iconNames.push(key);
    }
  }
  
  return iconNames.sort();
};

const ComponentsReferencePage: React.FC = () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [permissions, setPermissions] = useState<string[]>([
    PERMISSION_KEYS.DASHBOARD.VIEW,
  ]);
  const [shouldThrow, setShouldThrow] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  
  // Icon gallery state
  const [iconSearch, setIconSearch] = useState("");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState("tab1");
  
  // Sidebar navigation state
  const [activeSection, setActiveSection] = useState("buttons");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Create ref setter that returns void (for React 19 compatibility)
  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };
  
  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  // Get all icons and filter based on search
  const allIconNames = useMemo(() => getAllIconNames(), []);
  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return allIconNames;
    const searchLower = iconSearch.toLowerCase();
    return allIconNames.filter((name) =>
      name.toLowerCase().includes(searchLower)
    );
  }, [allIconNames, iconSearch]);

  // Copy icon name to clipboard
  const copyIconName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedIcon(name);
    showSuccess("Copied!", `"${name}" copied to clipboard`);
    setTimeout(() => setCopiedIcon(null), 2000);
  };
  
  // Sample tabs for TabNavigation demo
  const sampleTabs: TabItem[] = [
    { id: "tab1", label: "Overview", icon: Eye, testId: "tab-overview" },
    { id: "tab2", label: "Settings", icon: Settings, testId: "tab-settings" },
    { id: "tab3", label: "Users", icon: Users, badge: 12, testId: "tab-users" },
    { id: "tab4", label: "Disabled", icon: XCircle, disabled: true, testId: "tab-disabled" },
  ];

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAvatarUrl(undefined);
    }
  }, [avatarFile]);

  const sampleActionButtons: ActionButton[] = [
    {
      id: "1",
      title: "Create User",
      description: "Add a new user to the system",
      icon: Plus,
      testId: "action-create-user",
      onClick: () => showInfo("Action", "Create user clicked"),
    },
    {
      id: "2",
      title: "View Reports",
      description: "Access system reports",
      icon: BarChart3,
      testId: "action-view-reports",
      onClick: () => showInfo("Action", "View reports clicked"),
    },
    {
      id: "3",
      title: "Settings",
      description: "Configure system settings",
      icon: Settings,
      testId: "action-settings",
      onClick: () => showInfo("Action", "Settings clicked"),
    },
    {
      id: "4",
      title: "Help",
      description: "Get help and support",
      icon: AlertCircle,
      testId: "action-help",
      onClick: () => showInfo("Action", "Help clicked"),
    },
  ];

  const sampleAuditLogs: AuditLog[] = [
    {
      id: "1",
      userId: "user-1",
      user: {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        status: UserStatus.Active,
        permissions: [],
        userRoles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: undefined,
        lastLogin: new Date(),
        permissionKeys: [],
        userName: "johndoe",
        normalizedUserName: "JOHNDOE",
        normalizedEmail: "JOHN@EXAMPLE.COM",
        emailConfirmed: true,
        passwordHash: undefined,
        securityStamp: undefined,
        concurrencyStamp: undefined,
        phoneNumber: undefined,
        phoneNumberConfirmed: false,
        twoFactorEnabled: false,
        lockoutEnd: undefined,
        lockoutEnabled: false,
        accessFailedCount: 0,
      },
      eventType: AuditEventType.Login,
      description: "User logged in successfully",
      userAgent: "Mozilla/5.0",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      success: true,
      errorMessage: undefined,
      preChangeValue: undefined,
      postChangeValue: undefined,
    },
    {
      id: "2",
      userId: "user-2",
      user: {
        id: "user-2",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        status: UserStatus.Active,
        permissions: [],
        userRoles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        avatar: undefined,
        lastLogin: new Date(),
        permissionKeys: [],
        userName: "janesmith",
        normalizedUserName: "JANESMITH",
        normalizedEmail: "JANE@EXAMPLE.COM",
        emailConfirmed: true,
        passwordHash: undefined,
        securityStamp: undefined,
        concurrencyStamp: undefined,
        phoneNumber: undefined,
        phoneNumberConfirmed: false,
        twoFactorEnabled: false,
        lockoutEnd: undefined,
        lockoutEnabled: false,
        accessFailedCount: 0,
      },
      eventType: AuditEventType.Created,
      description: "New user account created",
      userAgent: undefined,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      success: true,
      errorMessage: undefined,
      preChangeValue: undefined,
      postChangeValue: undefined,
    },
    {
      id: "3",
      userId: "user-3",
      user: undefined,
      eventType: AuditEventType.FailedLogin,
      description: "Failed login attempt",
      userAgent: "Mozilla/5.0",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      success: false,
      errorMessage: "Invalid credentials",
      preChangeValue: undefined,
      postChangeValue: undefined,
    },
  ];

  const sampleListItems = [
    { id: 1, name: "Item 1", description: "First item" },
    { id: 2, name: "Item 2", description: "Second item" },
    { id: 3, name: "Item 3", description: "Third item" },
  ];

  const sampleTableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "inactive",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Moderator",
      status: "pending",
    },
  ];

  const sampleTableColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  const sampleGridItems = [
    { id: "1", title: "Grid Item 1" },
    { id: "2", title: "Grid Item 2" },
    { id: "3", title: "Grid Item 3" },
    { id: "4", title: "Grid Item 4" },
  ];

  return (
    <BasePage
      title="Components Reference"
      description="A comprehensive showcase of all available UI components"
      icon={Palette}
    >
      <div className={styles.pageContainer}>
        {/* Sidebar Navigation */}
        <aside className={cn(
          styles.sidebar,
          sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
        )}>
          <div className={styles.sidebarHeader}>
            {sidebarOpen && <span className={styles.sidebarTitle}>Sections</span>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={styles.sidebarToggle}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <nav className={styles.sidebarNav}>
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    styles.navButton,
                    activeSection === section.id && styles.navButtonActive
                  )}
                >
                  <Icon size={16} className={styles.navIcon} />
                  {sidebarOpen && <span className={styles.navLabel}>{section.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className={styles.mainContent}>
        <section 
          id="buttons" 
          ref={setSectionRef("buttons")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Plus className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Buttons</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Button Variants</h3>
              <div className={styles.componentExamples}>
                <Button variant="primary" icon={Plus}>
                  Primary
                </Button>
                <Button variant="secondary" icon={Settings}>
                  Secondary
                </Button>
                <Button variant="ghost" icon={Edit}>
                  Ghost
                </Button>
                <Button variant="danger" icon={Trash2}>
                  Danger
                </Button>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Button Sizes</h3>
              <div className={styles.componentExamples}>
                <Button size="sm" icon={Plus}>
                  Small
                </Button>
                <Button size="md" icon={Plus}>
                  Medium
                </Button>
                <Button size="lg" icon={Plus}>
                  Large
                </Button>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Button States</h3>
              <div className={styles.componentExamples}>
                <Button icon={Check}>Normal</Button>
                <Button loading icon={Check}>
                  Loading
                </Button>
                <Button disabled icon={XCircle}>
                  Disabled
                </Button>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Icon Only Buttons</h3>
              <div className={styles.componentExamples}>
                <Button variant="secondary" icon={Search} aria-label="Search" />
                <Button variant="secondary" icon={Edit} aria-label="Edit" />
                <Button variant="danger" icon={Trash2} aria-label="Delete" />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="cards" 
          ref={setSectionRef("cards")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <FileText className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Cards</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Basic Cards</h3>
              <div className={styles.componentExamples}>
                <Card
                  title="Simple Card"
                  description="This is a basic card with just content."
                  icon={User}
                  className={styles.cardWidth}
                />

                <Card
                  title="Card with Actions"
                  description="This card has action buttons in the footer."
                  icon={Settings}
                  actions={[
                    {
                      label: "View",
                      onClick: () => {},
                      variant: "secondary",
                      icon: Eye,
                    },
                    {
                      label: "Edit",
                      onClick: () => {},
                      variant: "primary",
                      icon: Edit,
                    },
                  ]}
                  className={styles.cardWidth}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Stats Cards</h3>
              <div className={styles.componentExamples}>
                <StatsCard
                  title="Total Users"
                  value="1,234"
                  change={{ value: "+12%", type: "increase" }}
                  icon={Users}
                />
                <StatsCard
                  title="Active Roles"
                  value="8"
                  change={{ value: "-2%", type: "decrease" }}
                  icon={Shield}
                />
                <StatsCard
                  title="Revenue"
                  value="$45,678"
                  change={{ value: "+5%", type: "increase" }}
                  icon={BarChart3}
                />
              </div>
            </div>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Dashboard Card</h3>
              <div className={styles.componentExamples}>
                <DashboardCard title="Overview" icon={BarChart3}>
                  <div className="p-4">
                    <p>Place any custom dashboard content here.</p>
                  </div>
                </DashboardCard>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="forms" 
          ref={setSectionRef("forms")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Edit className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Form Components</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Input Fields</h3>
              <div className={styles.componentExamples}>
                <div className="relative">
                  <Input
                    label="Text Input"
                    placeholder="Enter text..."
                    icon={User}
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Email Input"
                    type="email"
                    placeholder="Enter email..."
                    icon={Mail}
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Password Input"
                    type="password"
                    placeholder="Enter password..."
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Disabled Input"
                    placeholder="This is disabled"
                    disabled
                  />
                </div>
                <div className="relative">
                  <Input
                    label="Input with Error"
                    placeholder="This has an error"
                    error="This field is required"
                  />
                </div>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Search Input</h3>
              <div className={styles.componentExamples}>
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search components..."
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Filter Select</h3>
              <div className={styles.componentExamples}>
                <FilterSelect
                  value={filterValue}
                  onChange={setFilterValue}
                  options={[
                    { value: "all", label: "All Items" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  placeholder="Filter by status"
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Entity Toolbar</h3>
              <div className={styles.componentExamples}>
                <EntityToolbar
                  searchPlaceholder="Search users..."
                  filters={[
                    {
                      key: "status",
                      label: "Status",
                      options: [
                        { value: "", label: "All" },
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                      ],
                    },
                  ]}
                  sortFields={[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                  ]}
                  onApply={() => {}}
                  onClear={() => {}}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Permission Selector</h3>
              <div className={styles.componentExamples}>
                <PermissionSelector
                  selectedPermissions={permissions}
                  onPermissionToggle={(permission) => {
                    if (permissions.includes(permission)) {
                      setPermissions(
                        permissions.filter((p) => p !== permission)
                      );
                    } else {
                      setPermissions([...permissions, permission]);
                    }
                  }}
                  onBulkPermissionChange={setPermissions}
                />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="status" 
          ref={setSectionRef("status")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <AlertCircle className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Status & Feedback</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Status Badges</h3>
              <div className={styles.componentExamples}>
                <StatusBadge status="active" />
                <StatusBadge status="inactive" />
                <StatusBadge status="pending" />
                <StatusBadge status="suspended" />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Loading Spinner</h3>
              <div className={styles.componentExamples}>
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="data" 
          ref={setSectionRef("data")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <BarChart3 className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Data Display</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Table</h3>
              <div className={styles.componentExamples}>
                <TablePage
                  pagedResult={{
                    items: sampleTableData,
                    totalCount: sampleTableData.length,
                    pageNumber: 1,
                    pageSize: sampleTableData.length || 10,
                    totalPages: 1,
                  }}
                  tableConfig={{
                    columns: sampleTableColumns,
                    emptyMessage: "No data available",
                  }}
                  callbacks={{ onRowClick: () => {} }}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Pagination</h3>
              <div className={styles.componentExamples}>
                <Pagination
                  currentPage={2}
                  totalPages={10}
                  onPageChange={() => {}}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Grid</h3>
              <div className={styles.componentExamples}>
                <GridPage
                  pagedResult={{
                    items: sampleGridItems,
                    totalCount: sampleGridItems.length,
                    pageNumber: 1,
                    pageSize: 12,
                    totalPages: 1,
                  }}
                  callbacks={{
                    renderItem: (item: any) => (
                      <Card
                        title={item.title}
                        description="Example grid item"
                        icon={User}
                        className={styles.cardWidth}
                      />
                    ),
                  }}
                  gridConfig={{ itemsPerRow: 4, emptyStateTitle: "No items" }}
                  testid="components-grid"
                />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="modals" 
          ref={setSectionRef("modals")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Eye className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Modals & Dialogs</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Modal</h3>
              <div className={styles.componentExamples}>
                <Button onClick={() => setShowModal(true)} icon={Eye}>
                  Open Modal
                </Button>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Confirmation Dialog</h3>
              <div className={styles.componentExamples}>
                <Button
                  variant="danger"
                  onClick={() => setShowConfirmation(true)}
                  icon={AlertCircle}
                >
                  Show Confirmation
                </Button>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Danger Zone</h3>
              <div className={styles.componentExamples}>
                <DangerZone
                  title="Delete Account"
                  description="This action is irreversible."
                  buttonLabel="Delete"
                  onConfirm={() =>
                    showError("Account deleted", "This was a demo.")
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="theme" 
          ref={setSectionRef("theme")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Palette className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Theme</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Theme Toggle</h3>
              <div className={styles.componentExamples}>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="base" 
          ref={setSectionRef("base")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Settings className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Base Components</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Page Headers</h3>
              <div className={styles.componentExamples}>
                <PageHeader
                  title="Sample Page"
                  description="This is a sample page header component"
                  icon={Settings}
                />
              </div>
            </div>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Error Boundary</h3>
              <p className={styles.componentDescription}>
                Trigger an error to see the fallback UI.
              </p>
              <div className={styles.componentExamples}>
                <ErrorBoundary>
                  <div>
                    <Button
                      variant="danger"
                      icon={AlertCircle}
                      onClick={() => setShouldThrow(true)}
                    >
                      Trigger Error
                    </Button>
                    {shouldThrow &&
                      (() => {
                        throw new Error("Demo error");
                      })()}
                  </div>
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="user" 
          ref={setSectionRef("user")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <User className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>User Components</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>User Info</h3>
              <div className={styles.componentExamples}>
                <Card
                  title="John Doe"
                  description="john.doe@example.com"
                  icon={UserIcon}
                  layout="horizontal"
                  status="active"
                  detailsPerRow={2}
                  details={[
                    {
                      label: "Role",
                      value: ROLE_NAMES.ADMINISTRATOR,
                      icon: Key,
                    },
                    {
                      label: "Permissions",
                      value: "2 assigned",
                      icon: Users,
                    },
                    {
                      label: "Login",
                      value: "2024-01-15",
                      icon: Calendar,
                    },
                    {
                      label: "Created",
                      value: new Date().toLocaleDateString(),
                      icon: Mail,
                    },
                  ]}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>User Actions</h3>
              <div className={styles.componentExamples}>
                <UserActions
                  user={{
                    id: "1",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    role: {
                      id: "r1",
                      name: ROLE_NAMES.ADMINISTRATOR,
                      description: "",
                      permissions: [],
                      isSystem: false,
                      users: [],
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                    isActive: true,
                    userStatus: UserStatus.Active,
                    permissions: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    avatar: undefined,
                    customPermissionsCount: 0,
                    lastLogin: new Date(),
                    permissionKeys: undefined,
                  }}
                  onEditUser={() => {}}
                  onDeleteUser={() => {}}
                  onManageRoles={() => {}}
                  onManagePermissions={() => {}}
                  permissions={{
                    canViewUsers: true,
                    canCreateUsers: true,
                    canEditUsers: true,
                    canDeleteUsers: true,
                    canApproveUsers: true,
                    canRejectUsers: true,
                    canViewPendingUsers: true,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="permissions" 
          ref={setSectionRef("permissions")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Shield className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Permission Components</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Permission Guard</h3>
              <div className={styles.componentExamples}>
                <PermissionGuard permissions={[PERMISSION_KEYS.USERS.VIEW]}>
                  <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                    <p>
                      This content is protected by permission guard and only
                      visible to users with 'users:view' permission.
                    </p>
                  </div>
                </PermissionGuard>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Role Guard</h3>
              <div className={styles.componentExamples}>
                <RoleGuard role={ROLE_NAMES.ADMINISTRATOR}>
                  <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <p>
                      This content is protected by role guard and only visible
                      to administrators.
                    </p>
                  </div>
                </RoleGuard>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="additional" 
          ref={setSectionRef("additional")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Mail className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Additional Form Components</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Form Container</h3>
              <div className={styles.componentExamples}>
                <Form onSubmit={() => {}} className="max-w-md">
                  <Input
                    label="Sample Input"
                    placeholder="Enter text..."
                    icon={User}
                  />
                  <Button type="submit" icon={Check}>
                    Submit Form
                  </Button>
                </Form>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Dropdown</h3>
              <div className={styles.componentExamples}>
                <Dropdown
                  label="Select Option"
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                  ]}
                  value={dropdownValue}
                  onValueChange={setDropdownValue}
                  placeholderOption="Choose an option..."
                  className="max-w-xs"
                />
                <Dropdown
                  label="Dropdown with Error"
                  options={[
                    { value: "1", label: "One" },
                    { value: "2", label: "Two" },
                  ]}
                  error="This field is required"
                  className="max-w-xs"
                />
                <Dropdown
                  label="Dropdown with Helper Text"
                  options={[
                    { value: "a", label: "Option A" },
                    { value: "b", label: "Option B" },
                  ]}
                  helperText="Select an option from the list"
                  className="max-w-xs"
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Avatar Uploader</h3>
              <div className={styles.componentExamples}>
                <AvatarUploader
                  avatarUrl={avatarUrl}
                  editable
                  onChange={(file) => {
                    setAvatarFile(file);
                    showSuccess("Avatar", "File selected: " + file.name);
                  }}
                  onRemove={() => {
                    setAvatarFile(null);
                    showInfo("Avatar", "Avatar removed");
                  }}
                />
                <AvatarUploader
                  avatarUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23e2e8f0' width='150' height='150'/%3E%3Ccircle cx='75' cy='55' r='30' fill='%2394a3b8'/%3E%3Cellipse cx='75' cy='130' rx='45' ry='35' fill='%2394a3b8'/%3E%3C/svg%3E"
                  editable={false}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Toast Notifications</h3>
              <div className={styles.componentExamples}>
                <Button
                  onClick={() =>
                    showSuccess("Saved", "Your changes were saved.")
                  }
                >
                  Success
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => showInfo("Heads up", "Informational message")}
                >
                  Info
                </Button>
                <Button
                  variant="danger"
                  onClick={() => showError("Error", "Something went wrong")}
                >
                  Error
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => showWarning("Warning", "Please check inputs")}
                >
                  Warning
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="actions" 
          ref={setSectionRef("actions")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Grid3X3 className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Action Buttons</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>
                Action Buttons Grid (2 columns)
              </h3>
              <div className={styles.componentExamples}>
                <ActionButtons
                  actions={sampleActionButtons.slice(0, 2)}
                  columns={2}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>
                Action Buttons Grid (3 columns)
              </h3>
              <div className={styles.componentExamples}>
                <ActionButtons
                  actions={sampleActionButtons.slice(0, 3)}
                  columns={3}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>
                Action Buttons Grid (4 columns)
              </h3>
              <div className={styles.componentExamples}>
                <ActionButtons actions={sampleActionButtons} columns={4} />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="audit" 
          ref={setSectionRef("audit")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Calendar className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Audit Log Components</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Audit Log Card (Modern)</h3>
              <div className={styles.componentExamples}>
                <div className="max-w-md">
                  <AuditLogCard log={sampleAuditLogs[0]} variant="modern" />
                </div>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>
                Audit Log Card (Compact)
              </h3>
              <div className={styles.componentExamples}>
                <div className="max-w-md">
                  <AuditLogCard log={sampleAuditLogs[1]} variant="compact" />
                </div>
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Audit Log Timeline</h3>
              <div className={styles.componentExamples}>
                <div className="max-w-2xl">
                  <AuditLogTimeline
                    logs={sampleAuditLogs}
                    title="Recent Activity"
                    emptyMessage="No activity found"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="list" 
          ref={setSectionRef("list")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <FileText className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>List Component</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>List with Custom Render</h3>
              <div className={styles.componentExamples}>
                <List
                  items={sampleListItems}
                  renderItem={(item) => (
                    <Card
                      title={item.name}
                      description={item.description}
                      icon={FileText}
                      className="components-reference-card-width mb-4"
                    />
                  )}
                  testId="sample-list"
                />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="empty" 
          ref={setSectionRef("empty")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Inbox className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Empty State</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Empty State with Icon</h3>
              <div className={styles.componentExamples}>
                <EmptyState
                  title="No items found"
                  description="There are no items to display at this time."
                  icon={Inbox}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Empty State with Action</h3>
              <div className={styles.componentExamples}>
                <EmptyState
                  title="No data available"
                  description="Get started by creating your first item."
                  icon={Plus}
                  primaryAction={{
                    label: "Create Item",
                    onClick: () => showInfo("Action", "Create item clicked"),
                  }}
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Empty State Minimal</h3>
              <div className={styles.componentExamples}>
                <EmptyState title="Nothing here" />
              </div>
            </div>
          </div>
        </section>

        <section 
          id="tabs" 
          ref={setSectionRef("tabs")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Menu className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Tab Navigation</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Default Tabs</h3>
              <div className={styles.componentExamples}>
                <TabNavigation
                  tabs={sampleTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  variant="default"
                  testId="demo-tabs-default"
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Pills Variant</h3>
              <div className={styles.componentExamples}>
                <TabNavigation
                  tabs={sampleTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  variant="pills"
                  testId="demo-tabs-pills"
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Underline Variant</h3>
              <div className={styles.componentExamples}>
                <TabNavigation
                  tabs={sampleTabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  variant="underline"
                  testId="demo-tabs-underline"
                />
              </div>
            </div>

            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Tab Sizes</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Small</p>
                  <TabNavigation
                    tabs={sampleTabs.slice(0, 3)}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    size="sm"
                    testId="demo-tabs-sm"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Medium (default)</p>
                  <TabNavigation
                    tabs={sampleTabs.slice(0, 3)}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    size="md"
                    testId="demo-tabs-md"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Large</p>
                  <TabNavigation
                    tabs={sampleTabs.slice(0, 3)}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    size="lg"
                    testId="demo-tabs-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section 
          id="icons" 
          ref={setSectionRef("icons")} 
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <Grid3X3 className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Icon Gallery ({allIconNames.length} icons)</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.componentGroup}>
              <h3 className={styles.componentGroupTitle}>Search Icons</h3>
              <p className={styles.iconGalleryInfo}>
                Click on any icon to copy its name. Use in imports: <code className={styles.iconGalleryCode}>import {"{ IconName }"} from "lucide-react"</code>
              </p>
              <div className={styles.searchContainer}>
                <SearchInput
                  value={iconSearch}
                  onChange={setIconSearch}
                  placeholder="Search icons... (e.g., user, arrow, check)"
                />
              </div>
              <p className={styles.iconCount}>
                Showing {filteredIcons.length} of {allIconNames.length} icons
              </p>
            </div>

            <div className={styles.componentGroup}>
              <div className={styles.iconGrid}>
                {filteredIcons.slice(0, 240).map((iconName) => {
                  const IconComponent = (LucideIcons as any)[iconName];
                  const isCopied = copiedIcon === iconName;
                  
                  return (
                    <button
                      key={iconName}
                      onClick={() => copyIconName(iconName)}
                      className={cn(
                        styles.iconButton,
                        isCopied && styles.iconButtonCopied
                      )}
                      title={`Click to copy: ${iconName}`}
                    >
                      {IconComponent && (
                        <IconComponent className={styles.iconPreview} />
                      )}
                      <span className={styles.iconName}>
                        {isCopied ? <Check className="w-3 h-3 mx-auto" /> : iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
              {filteredIcons.length > 240 && (
                <p className={cn(styles.iconCount, styles.iconCountCenter)}>
                  Showing first 240 icons. Use search to find specific icons.
                </p>
              )}
              {filteredIcons.length === 0 && (
                <EmptyState
                  title="No icons found"
                  description={`No icons match "${iconSearch}". Try a different search term.`}
                  icon={Search}
                />
              )}
            </div>
          </div>
        </section>
        </div>
      </div>

      <ModalPortal>
        <ModalPage
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Sample Modal"
          size="lg"
        >
          <div className="space-y-4">
            <p>This is a sample modal to demonstrate the modal component.</p>
            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                icon={XCircle}
              >
                Close
              </Button>
              <Button onClick={() => setShowModal(false)} icon={Check}>
                Confirm
              </Button>
            </div>
          </div>
        </ModalPage>
      </ModalPortal>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          setShowConfirmation(false);
        }}
        title="Confirm Action"
        message="Are you sure you want to perform this action? This cannot be undone."
        confirmText="Yes, proceed"
        cancelText="Cancel"
      />
    </BasePage>
  );
};

export default ComponentsReferencePage;
