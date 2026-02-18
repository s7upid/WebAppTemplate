import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserFormModal from "./UserFormModal";
import { TEST_IDS } from "@/config/constants";
import { mockUsers } from "@/mock/data";
import { ToastProvider } from "@/hooks/ui/useToast";

jest.mock("@/components/ModalPage/ModalPage", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, title, children }: any) =>
    isOpen ? (
      <div data-testid={TEST_IDS.MODAL}>
        <div>{title}</div>
        <button data-testid={TEST_IDS.MODAL_CLOSE} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    ) : null,
}));
jest.mock("@/components/Button/Button", () => ({
  __esModule: true,
  default: ({ children, onClick, loading, variant, type, form }: any) => (
    <button
      data-testid={`button-${variant || "default"}`}
      onClick={onClick}
      type={type}
      form={form}
      disabled={false}
      data-loading={loading}
    >
      {children}
    </button>
  ),
}));
jest.mock("@/components/Input/Input", () => ({
  __esModule: true,
  default: ({ label, error, ...rest }: any) => (
    <label>
      {label}
      <input {...rest} />
      {error && <p data-testid={TEST_IDS.ERROR_MESSAGE}>{error}</p>}
    </label>
  ),
}));

const permissions = { canEditUsers: true } as any;
const user = mockUsers[1] as any;

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useRolesQuery: () => ({
    roles: (jest.requireActual("@/mock/data") as any).mockRoles,
    paginationResult: {
      items: (jest.requireActual("@/mock/data") as any).mockRoles,
      totalCount: (jest.requireActual("@/mock/data") as any).mockRoles.length,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
    },
    isLoading: false,
    error: null,
    paginationHandlers: {
      changePage: jest.fn(),
      changePageSize: jest.fn(),
      clearAll: jest.fn(),
      refreshWithCurrentFilters: jest.fn(),
      refreshWithParams: jest.fn(),
    },
    refetch: jest.fn(),
    add: jest.fn().mockResolvedValue({ success: true }),
    edit: jest.fn().mockResolvedValue({ success: true }),
    remove: jest.fn().mockResolvedValue({ success: true }),
  }),
}));

const mockHandleSubmitForm = jest.fn();

jest.mock("@/utils", () => ({
  SecureStorage: {
    getToken: jest.fn(() => null),
    getUser: jest.fn(() => null),
    setToken: jest.fn(),
    setUser: jest.fn(),
    clear: jest.fn(),
  },
  env: {
    VITE_STORAGE_SECRET_KEY: "test-secret-key",
    VITE_APP_NAME: "test-app",
    VITE_USE_MOCK_DATA: "false",
    VITE_API_URL: "http://localhost:3000",
  },
  deriveEffectivePermissionKeys: jest.fn((keys, perms) => {
    const providedKeys = Array.isArray(keys) ? keys : [];
    const permissionObjectKeys = Array.isArray(perms)
      ? perms.map((p: any) => (typeof p === "string" ? p : p.key))
      : [];
    return Array.from(new Set([...providedKeys, ...permissionObjectKeys]));
  }),
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
  cn: jest.fn((...args) => args.filter(Boolean).join(" ")),
  Portal: ({ children }: any) => children,
  handleEntityDelete: jest.fn(),
  handleSubmitForm: (...args: any[]) => mockHandleSubmitForm(...args),
  handleEntitySave: jest.fn(),
  useRouteInfo: jest.fn(),
  parseRouteInfo: jest.fn(),
  getNavigationUrls: jest.fn(),
  getActiveTab: jest.fn(),
  isNavigationActive: jest.fn(),
  useEntityNavigation: jest.fn(),
  useGenericNavigationFunctions: jest.fn(() => ({
    goToLogin: jest.fn(),
    goToRoles: jest.fn(),
    goToUsers: jest.fn(),
  })),
}));

describe("UserFormModal", () => {
  const onClose = jest.fn();
  const onSave = jest.fn().mockResolvedValue({ success: true });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleSubmitForm.mockImplementation(
      async ({ data, onSave: onSaveCallback }) => {
        const result = await onSaveCallback(data);
        return { success: true, result };
      }
    );
  });

  it("returns null when cannot edit and not profile edit", () => {
    const { container } = render(
      <UserFormModal
        permissions={{ canEditUsers: false } as any}
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        user={user}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders modal with user data", async () => {
    render(
      <ToastProvider>
        <UserFormModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
          user={user}
        />
      </ToastProvider>
    );

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
  });

  it("renders and submits update", async () => {
    render(
      <ToastProvider>
        <UserFormModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
          user={user}
        />
      </ToastProvider>
    );

    const firstNameInput = screen.getByLabelText("First Name");
    const lastNameInput = screen.getByLabelText("Last Name");

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, "JohnUpdated");
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, "Name");

    const submitButton = screen.getByText("Save Changes");
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(mockHandleSubmitForm).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    await waitFor(
      () => {
        expect(onSave).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    expect(onClose).toHaveBeenCalled();
  });

  it("closes modal when cancel is clicked", async () => {
    render(
      <ToastProvider>
        <UserFormModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
          user={user}
        />
      </ToastProvider>
    );

    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("displays correct title for edit mode", () => {
    render(
      <ToastProvider>
        <UserFormModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
          user={user}
        />
      </ToastProvider>
    );

    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  it("displays correct title for profile edit mode", () => {
    render(
      <ToastProvider>
        <UserFormModal
          permissions={permissions}
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
          user={user}
          isProfileEdit={true}
        />
      </ToastProvider>
    );

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });
});
