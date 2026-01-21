import React from "react";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import HomePage from "./pages/Home";

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

// tsparticles Mock 처리 (테스트 환경에서 에러 방지)
vi.mock("@tsparticles/react", () => ({
  default: () => null,
  initParticlesEngine: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@tsparticles/all", () => ({
  loadAll: vi.fn().mockResolvedValue(undefined),
}));

test("renders the heading correctly", async () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
  const headingElement = await screen.findByRole(
    "heading",
    {
      name: /One for a line, a line for all./i,
      level: 1,
    },
    { timeout: 5000 } // lazy loading을 위해 timeout 증가
  );
  expect(headingElement).toBeInTheDocument();
});

vi.mock("@posts/1-hello-world.md", () => ({
  html: "<p>Test content</p>",
  attributes: {
    title: "Test Post",
    date: "2025-04-11",
  },
}));
