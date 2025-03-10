import { render as RtlRender } from "@testing-library/react";

import { ReactElement } from "react";
import { MemoryRouter } from "react-router";

// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
function customRender(ui: ReactElement) {
  return RtlRender(<MemoryRouter>{ui}</MemoryRouter>);
}

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
