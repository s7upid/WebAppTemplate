import { render, screen } from "@testing-library/react";
import RolePermissionsSection from "@/pages/roles/components/RolePermissionsSection";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

jest.mock("lucide-react", () => new Proxy({}, { get: () => () => null }));

describe("RolePermissionsSection", () => {
  it("renders empty state when no permissions", () => {
    render(
      <RolePermissionsSection
        role={
          {
            id: "1",
            name: "r",
            description: "",
            isSystem: false,
            userCount: 0,
            permissions: [],
          } as any
        }
      />
    );
    expect(screen.getByText(/No permissions assigned/)).toBeInTheDocument();
  });

  it("renders permission items", () => {
    render(
      <RolePermissionsSection
        role={
          {
            id: "1",
            name: "r",
            description: "",
            isSystem: true,
            userCount: 0,
            permissions: [
              { id: "p1", key: PERMISSION_KEYS.USERS.VIEW, name: "Users View" },
            ],
          } as any
        }
      />
    );
    expect(screen.getByText("Users View")).toBeInTheDocument();
    expect(screen.getByText(PERMISSION_KEYS.USERS.VIEW)).toBeInTheDocument();
  });
});
