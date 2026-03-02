import { cn } from "./cn";

describe("cn utility", () => {
  it("combines class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("includes conditional classes when truthy", () => {
    const truthy = true;
    const falsy = false;
    expect(cn("class1", truthy && "class2", falsy && "class3")).toBe(
      "class1 class2"
    );
  });

  it("ignores undefined and null values", () => {
    expect(cn("class1", undefined, null, "class2")).toBe("class1 class2");
  });

  it("ignores empty strings", () => {
    expect(cn("class1", "", "class2")).toBe("class1 class2");
  });

  it("flattens arrays of classes", () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
  });

  it("includes object keys with true values", () => {
    expect(
      cn({
        class1: true,
        class2: false,
        class3: true,
      })
    ).toBe("class1 class3");
  });

  it("merges mixed input types", () => {
    expect(
      cn(
        "class1",
        ["class2", "class3"],
        {
          class4: true,
          class5: false,
        },
        "class6"
      )
    ).toBe("class1 class2 class3 class4 class6");
  });

  it("returns empty string for empty input", () => {
    expect(cn()).toBe("");
  });

  it("returns single class unchanged", () => {
    expect(cn("class1")).toBe("class1");
  });

  it("flattens nested arrays", () => {
    expect(cn(["class1", ["class2", "class3"]])).toBe("class1 class2 class3");
  });

  it("supports complex conditional logic", () => {
    const isActive = true;
    const isDisabled = false;
    const size = "large" as const;

    expect(
      cn(
        "base-class",
        {
          active: isActive,
          disabled: isDisabled,
          large: size === "large",
          small: false,
        },
        "additional-class"
      )
    ).toBe("base-class active large additional-class");
  });

  it("preserves duplicate classes", () => {
    expect(cn("class1", "class2", "class1")).toBe("class1 class2 class1");
  });

  it("trims whitespace in class names", () => {
    expect(cn(" class1 ", " class2 ")).toBe("class1 class2");
  });

  it("supports special characters in class names", () => {
    expect(cn("class-1", "class_2", "class.3")).toBe("class-1 class_2 class.3");
  });
});
