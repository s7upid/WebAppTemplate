// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import AvatarUploader from "./AvatarUploader";

describe("AvatarUploader", () => {
  const mockOnChange = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("renders placeholder when no avatarUrl is provided", () => {
    const { container } = render(<AvatarUploader />);

    // Check that avatar image is not rendered
    expect(screen.queryByAltText("Profile")).not.toBeTruthy();
    // Check that placeholder icon exists (User icon from lucide-react)
    const placeholder = container.querySelector('[class*="avatarPlaceholder"]');
    expect(placeholder).toBeTruthy();
  });

  it("renders avatar image when avatarUrl is provided", () => {
    render(<AvatarUploader avatarUrl="https://example.com/avatar.jpg" />);

    const img = screen.getByAltText("Profile");
    expect(img).toBeTruthy();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("does not show upload controls when editable is false", () => {
    render(<AvatarUploader editable={false} />);

    expect(screen.queryByText("Upload Photo")).not.toBeTruthy();
  });

  it("shows upload controls when editable is true", () => {
    render(<AvatarUploader editable={true} />);

    expect(screen.getByText("Upload Photo")).toBeTruthy();
  });

  it("calls onChange when file is selected", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const { container } = render(
      <AvatarUploader editable={true} onChange={mockOnChange} />
    );

    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
      expect(mockOnChange).toHaveBeenCalledWith(file);
    }
  });

  it("shows remove button when avatarUrl is provided and editable is true", () => {
    render(
      <AvatarUploader
        avatarUrl="https://example.com/avatar.jpg"
        editable={true}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText("Remove Photo")).toBeTruthy();
  });

  it("does not show remove button when avatarUrl is not provided", () => {
    render(<AvatarUploader editable={true} onRemove={mockOnRemove} />);

    expect(screen.queryByText("Remove Photo")).not.toBeTruthy();
  });

  it("calls onRemove when remove button is clicked", () => {
    render(
      <AvatarUploader
        avatarUrl="https://example.com/avatar.jpg"
        editable={true}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByText("Remove Photo");
    fireEvent.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("accepts custom className", () => {
    const { container } = render(
      <AvatarUploader className="custom-avatar-class" />
    );

    expect(container.firstChild).toHaveClass("custom-avatar-class");
  });

  it("accepts only image files", () => {
    const { container } = render(
      <AvatarUploader editable={true} onChange={mockOnChange} />
    );

    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    if (input) {
      expect(input).toHaveAttribute("accept", "image/*");
    }
  });
});
