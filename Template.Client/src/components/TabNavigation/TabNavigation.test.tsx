import { render, screen, fireEvent } from "@testing-library/react";
import TabNavigation, { TabItem } from "./TabNavigation";
import { Users, Clock, Settings } from "lucide-react";

const mockTabs: TabItem[] = [
  { id: "all", label: "All Items", icon: Users, testId: "all-tab" },
  { id: "pending", label: "Pending", icon: Clock, permission: "items:approve", testId: "pending-tab" },
  { id: "settings", label: "Settings", icon: Settings, testId: "settings-tab" },
];

describe("TabNavigation", () => {
  it("renders all tabs when no permission check is needed", () => {
    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="all"
        onTabChange={() => {}}
      />
    );

    expect(screen.getByTestId("all-tab")).toBeInTheDocument();
    expect(screen.getByTestId("pending-tab")).toBeInTheDocument();
    expect(screen.getByTestId("settings-tab")).toBeInTheDocument();
  });

  it("hides tabs when permission is not granted", () => {
    const hasPermission = (permission: string) => permission !== "items:approve";

    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="all"
        onTabChange={() => {}}
        hasPermission={hasPermission}
      />
    );

    expect(screen.getByTestId("all-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("pending-tab")).not.toBeInTheDocument();
    expect(screen.getByTestId("settings-tab")).toBeInTheDocument();
  });

  it("calls onTabChange when clicking a tab", () => {
    const onTabChange = jest.fn();

    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="all"
        onTabChange={onTabChange}
      />
    );

    fireEvent.click(screen.getByTestId("settings-tab"));
    expect(onTabChange).toHaveBeenCalledWith("settings");
  });

  it("applies active styles to the active tab", () => {
    render(
      <TabNavigation
        tabs={mockTabs}
        activeTab="settings"
        onTabChange={() => {}}
      />
    );

    const settingsTab = screen.getByTestId("settings-tab");
    expect(settingsTab.className).toMatch(/tabActive|Active/i);
  });

  it("renders badges when provided", () => {
    const tabsWithBadge: TabItem[] = [
      { id: "pending", label: "Pending", badge: 5 },
      { id: "other", label: "Other" }, // Need 2+ tabs to render
    ];

    render(
      <TabNavigation
        tabs={tabsWithBadge}
        activeTab="pending"
        onTabChange={() => {}}
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("disables tabs when disabled prop is true", () => {
    const tabsWithDisabled: TabItem[] = [
      { id: "disabled", label: "Disabled Tab", disabled: true },
      { id: "enabled", label: "Enabled Tab" },
    ];

    render(
      <TabNavigation
        tabs={tabsWithDisabled}
        activeTab="enabled"
        onTabChange={() => {}}
      />
    );

    const disabledTab = screen.getByText("Disabled Tab").closest("button");
    expect(disabledTab).toBeDisabled();
  });

  it("returns null when no tabs are visible", () => {
    const hasPermission = () => false;
    const tabsWithPermissions: TabItem[] = [
      { id: "protected", label: "Protected", permission: "some:permission" },
    ];

    const { container } = render(
      <TabNavigation
        tabs={tabsWithPermissions}
        activeTab="protected"
        onTabChange={() => {}}
        hasPermission={hasPermission}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when only one tab is visible (no need for tabs)", () => {
    const singleTab: TabItem[] = [
      { id: "only", label: "Only Tab" },
    ];

    const { container } = render(
      <TabNavigation
        tabs={singleTab}
        activeTab="only"
        onTabChange={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("uses isVisible prop to control tab visibility", () => {
    const tabsWithVisibility: TabItem[] = [
      { id: "visible", label: "Visible", isVisible: true },
      { id: "hidden", label: "Hidden", isVisible: false },
      { id: "default", label: "Default" },
    ];

    render(
      <TabNavigation
        tabs={tabsWithVisibility}
        activeTab="visible"
        onTabChange={() => {}}
      />
    );

    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    expect(screen.getByText("Default")).toBeInTheDocument();
  });
});

