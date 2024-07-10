// import { Issue } from "@/components/components";
import { PropsWithChildren } from "react";

export interface LayoutProps extends PropsWithChildren {}

export type RouteLoaderData = {
  title?: string;
  issue: Issue;
  list: Issue[];
  query: string;
  last?: number; // 마지막 페이지 번호
  page?: number; // 현재 페이지 번호
};
