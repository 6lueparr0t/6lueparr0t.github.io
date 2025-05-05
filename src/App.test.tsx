import React from "react";

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import App from "./App";

// 모듈을 전체 Mock 처리
vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ ...props }) => <div data-testid="mock-carousel">{props.children}</div>,
  CarouselApi: vi.fn(), // 타입을 빈 함수로 Mock 처리
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-carousel-item">{children}</div>
  ),
  CarouselNext: () => <button data-testid="mock-carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="mock-carousel-previous">Previous</button>,
  CarouselThumbs: ({ ...props }) => <div data-testid="mock-carousel">{props.children}</div>,
}));

test("renders the heading correctly", async () => {
  render(<App />);
  const headingElement = await screen.findByRole("heading", {
    name: /One for a line, a line for all./i,
    level: 2,
  });
  expect(headingElement).toBeInTheDocument();
});

vi.mock("@posts/1-hello-world.md", () => ({
  html: "<p>Test content</p>",
  attributes: {
    title: "Test Post",
    date: "2025-04-11",
  },
}));
