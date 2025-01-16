import "@testing-library/jest-dom";
import { vi } from "vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

// IntersectionObserver Mock
class IntersectionObserverMock implements IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = "";
  thresholds: ReadonlyArray<number> = [];

  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = IntersectionObserverMock;
global.scrollTo = vi.fn();

vi.mock("embla-carousel", () => ({
  default: () => ({
    activate: vi.fn(),
    destroy: vi.fn(),
  }),
}));
