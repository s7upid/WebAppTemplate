import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AuditLogTimeline from "./AuditLogTimeline";
import { AuditLog, AuditEventType } from "@/models";

const createMockLog = (id: string, eventType: AuditEventType): AuditLog => ({
  id,
  userId: "1",
  user: undefined,
  eventType,
  description: `Test event ${id}`,
  userAgent: "Mozilla/5.0",
  timestamp: new Date(),
  success: true,
  errorMessage: undefined,
  preChangeValue: undefined,
  postChangeValue: undefined,
});

describe("AuditLogTimeline", () => {
  it("renders with logs", () => {
    const logs = [
      createMockLog("1", AuditEventType.Login),
      createMockLog("2", AuditEventType.Logout),
    ];

    render(<AuditLogTimeline logs={logs} />);

    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("Logout")).toBeTruthy();
  });

  it("renders with title", () => {
    const logs = [createMockLog("1", AuditEventType.Login)];
    render(<AuditLogTimeline logs={logs} title="Recent Activity" />);

    expect(screen.getByText("Recent Activity")).toBeTruthy();
  });

  it("renders empty message when logs array is empty", () => {
    render(<AuditLogTimeline logs={[]} />);

    expect(screen.getByText("No recent activity")).toBeTruthy();
  });

  it("renders custom empty message", () => {
    render(
      <AuditLogTimeline logs={[]} emptyMessage="No audit logs available" />
    );

    expect(screen.getByText("No audit logs available")).toBeTruthy();
  });

  it("limits logs to maxItems when maxItems prop is provided", () => {
    const logs = [
      createMockLog("1", AuditEventType.Login),
      createMockLog("2", AuditEventType.Logout),
      createMockLog("3", AuditEventType.PasswordChange),
    ];

    render(<AuditLogTimeline logs={logs} maxItems={2} />);

    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("Logout")).toBeTruthy();
    expect(screen.queryByText("PasswordChange")).toBeFalsy();
  });

  it("renders all logs when maxItems is not provided", () => {
    const logs = [
      createMockLog("1", AuditEventType.Login),
      createMockLog("2", AuditEventType.Logout),
      createMockLog("3", AuditEventType.PasswordChange),
    ];

    render(<AuditLogTimeline logs={logs} />);

    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("Logout")).toBeTruthy();
    expect(screen.getByText("PasswordChange")).toBeTruthy();
  });

  it("renders without title when title prop is not provided", () => {
    const logs = [createMockLog("1", AuditEventType.Login)];
    const { container } = render(<AuditLogTimeline logs={logs} />);

    expect(screen.getByText("Login")).toBeTruthy();
    expect(container.querySelector("h2")).toBeFalsy();
  });
});
