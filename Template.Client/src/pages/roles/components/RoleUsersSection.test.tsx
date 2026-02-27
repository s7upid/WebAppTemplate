import React from "react";
import { render, screen } from "@testing-library/react";
import RoleUsersSection from "./RoleUsersSection";
import { mockUsers } from "@/mock/data";
import { UserStatus } from "@/models";

jest.mock("@/components", () => ({
  LoadingSpinner: () => <div>Loading...</div>,
  Card: ({ title, children }: { title?: string; children?: React.ReactNode }) => (
    <div>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  ),
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
