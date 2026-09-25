import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QrGeneratorForm } from "@/components/qr/qr-generator-form";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
import { toast } from "sonner";

describe("QrGeneratorForm", () => {
  it("disables the button while the input is empty", () => {
    render(<QrGeneratorForm onGenerate={vi.fn()} />);
    expect(screen.getByRole("button", { name: /generate qr code/i })).toBeDisabled();
  });

  it("submits the normalized URL and clears the field", async () => {
    const onGenerate = vi.fn().mockResolvedValue(undefined);
    render(<QrGeneratorForm onGenerate={onGenerate} />);
    const input = screen.getByLabelText("URL");
    await userEvent.type(input, "example.com{Enter}");
    expect(onGenerate).toHaveBeenCalledWith("https://example.com");
    expect(input).toHaveValue("");
  });

  it("shows an Invalid URL toast and inline error for bad input", async () => {
    const onGenerate = vi.fn();
    render(<QrGeneratorForm onGenerate={onGenerate} />);
    await userEvent.type(screen.getByLabelText("URL"), "javascript:alert(1){Enter}");
    expect(onGenerate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Invalid URL", expect.anything());
    expect(screen.getByRole("alert")).toHaveTextContent(/valid URL/i);
    expect(screen.getByLabelText("URL")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows a failure toast when generation throws", async () => {
    const onGenerate = vi.fn().mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<QrGeneratorForm onGenerate={onGenerate} />);
    await userEvent.type(screen.getByLabelText("URL"), "https://example.com{Enter}");
    expect(toast.error).toHaveBeenCalledWith("Generation Failed", expect.anything());
  });
});
