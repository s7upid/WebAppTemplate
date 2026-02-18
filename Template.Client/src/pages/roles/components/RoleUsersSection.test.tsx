import { render, screen } from "@testing-library/react";
import RoleUsersSection from "./RoleUsersSection";
import { mockUsers } from "@/mock/data";
import { UserStatus } from "@/models";

jest.mock("@/components/LoadingSpinner/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

describe("RoleUsersSection", () => {
  it("renders user list with counts and status", () => {
    const user = mockUsers.find((u) => u.userStatus === UserStatus.Active) as any;

    render(
      <RoleUsersSection
        users={[user]}
        usersLoading={false}
        onUserClick={() => {}}
      />
    );

    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });
});
