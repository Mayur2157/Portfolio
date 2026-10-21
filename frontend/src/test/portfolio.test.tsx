import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ContactForm } from "../components/sections/ContactForm";
import { Projects } from "../components/sections/Projects";
import { projects } from "../content/projects";

const VALID = { Name: "Asha", Email: "asha@example.com", Subject: "Hello", Message: "Hi there" };

function fillForm(values: Record<string, string>) {
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }),
  );
}

describe("project filters", () => {
  it("marks the active filter as pressed and shows only matching projects", () => {
    render(<Projects repos={{ status: "error" }} />);
    const all = screen.getByRole("button", { name: /^All/ });
    const vision = screen.getByRole("button", { name: /Computer Vision/ });
    expect(all.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);

    fireEvent.click(vision);

    expect(vision.getAttribute("aria-pressed")).toBe("true");
    expect(all.getAttribute("aria-pressed")).toBe("false");
    const expected = projects.filter((project) => project.category === "vision").length;
    expect(screen.getAllByRole("article")).toHaveLength(expected);
  });
});

describe("contact form", () => {
  it("validates on the client, flags each field and focuses the first", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<ContactForm />);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    for (const label of ["Name", "Email", "Subject", "Message"]) {
      expect(screen.getByLabelText(label).getAttribute("aria-invalid")).toBe("true");
    }
    expect(screen.getByText("Please enter your email.")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps server validation errors onto the matching field", async () => {
    mockFetch(422, {
      message: "Please fix the highlighted fields and try again.",
      errors: { email: "Please enter a valid email address, like name@example.com." },
    });
    render(<ContactForm />);
    fillForm(VALID);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await screen.findByText("Please enter a valid email address, like name@example.com.");
    const email = screen.getByLabelText("Email");
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(email.getAttribute("aria-describedby")).toBe("contact-email-error");
    expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBeNull();
    expect(screen.getByRole("alert").textContent).toBe("Please fix the highlighted fields and try again.");
  });

  it("confirms success and clears the form", async () => {
    const fetchSpy = mockFetch(202, { message: "Thank you for your message! I'll get back to you soon." });
    render(<ContactForm />);
    fillForm(VALID);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await screen.findByText("Thank you for your message! I'll get back to you soon.");
    const sent = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body)) as Record<string, string>;
    expect(sent).toEqual({ name: "Asha", email: "asha@example.com", subject: "Hello", message: "Hi there", website: "" });
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("");
  });

  it("explains a network failure with a next step", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));
    render(<ContactForm />);
    fillForm(VALID);

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/Couldn't reach the server/));
  });
});
