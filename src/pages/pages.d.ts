// import { Issue } from "@/components/components";
import { PropsWithChildren } from "react";

export interface LayoutProps extends PropsWithChildren {}

export type RouteLoaderData = {
  title?: string;
  issue: Issue;
  comments: Issue[];
  list: Issue[];
  query?: Query;
  page?: number; // 현재 페이지 번호
  next?: number; // 다음 페이지 여부
  prev?: number; // 이전 페이지 여부
};
