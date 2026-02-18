import { render, screen, fireEvent } from "@testing-library/react";
import RoleActions from "@/pages/roles/components/RoleActions";
import { TEST_IDS } from "@/config";
import { mockRoles } from "@/mock/data";

jest.mock("@/components/DangerZone/DangerZone", () => ({
  __esModule: true,
  default: ({ onConfirm, testId }: any) => (
    <button data-testid={testId} onClick={onConfirm}>
      danger
    </button>
  ),
}));
jest.mock("lucide-react", () => new Proxy({}, { get: () => () => null }));

const role = { ...mockRoles[1], isSystem: false } as any;

describe("RoleActions", () => {
  it("shows edit action and triggers callbacks based on permissions", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(
      <RoleActions
        permissions={{ canEditRoles: true, canDeleteRoles: true } as any}
        role={role}
        onEditRole={onEdit}
        onDeleteRole={onDelete}
      />
    );
    fireEvent.click(screen.getByTestId(TEST_IDS.CONFIRM_DELETE_BUTTON));
    expect(onDelete).toHaveBeenCalledWith(role);
  });

  it("hides delete for system role", () => {
    render(
      <RoleActions
        permissions={{ canEditRoles: true, canDeleteRoles: true } as any}
        role={{ ...role, isSystem: true }}
      />
    );
    expect(screen.queryByTestId(TEST_IDS.CONFIRM_DELETE_BUTTON)).toBeNull();
  });

  it("disables edit when permission missing", () => {
    const onEdit = jest.fn();
    render(
      <RoleActions
        permissions={{ canEditRoles: false, canDeleteRoles: true } as any}
        role={role}
        onEditRole={onEdit}
      />
    );

    expect(screen.queryByTestId("edit-role-button")).toBeNull();
  });
});
