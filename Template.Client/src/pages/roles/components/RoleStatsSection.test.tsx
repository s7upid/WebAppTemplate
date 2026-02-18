import { render, screen } from "@testing-library/react";
import RoleStatsSection from "@/pages/roles/components/RoleStatsSection";

jest.mock("lucide-react", () => new Proxy({}, { get: () => () => null }));

describe("RoleStatsSection", () => {
  it("renders stats with system/custom labels", () => {
    const role = {
      id: "1",
      name: "r",
      description: "",
      isSystem: true,
      users: [{ id: "1" }, { id: "2" }],
      createdAt: new Date().toISOString(),
      permissions: [],
    } as any;
    render(<RoleStatsSection role={role} />);
    expect(screen.getByText(/System Role/)).toBeInTheDocument();
    expect(screen.getByText(/2 users/)).toBeInTheDocument();
    expect(screen.getByText(/Created/)).toBeInTheDocument();
  });
});
