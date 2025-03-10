import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import React from "react";

import App from "./App";

// 모듈을 전체 Mock 처리
vi.mock("@/components/ui/carousel", () => ({
  // Carousel을 forwardRef로 Mock 처리
  Carousel: ({ ref, ...props }) => (
    <div ref={ref} data-testid="mock-carousel">
      {props.children}
    </div>
  ),
  CarouselApi: vi.fn(), // 타입을 빈 함수로 Mock 처리
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-carousel-item">{children}</div>
  ),
  CarouselNext: () => <button data-testid="mock-carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="mock-carousel-previous">Previous</button>,
}));

test("renders the heading correctly", () => {
  render(<App />);
  const headingElement = screen.getByRole("heading", { name: /One for a line, a line for all./i });
  expect(headingElement).toBeInTheDocument();
});
