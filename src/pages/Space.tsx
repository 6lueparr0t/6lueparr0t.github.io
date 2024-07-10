import React, { Suspense } from "react";
import {
  Await,
  defer,
  useRouteLoaderData,
} from "react-router-dom";
import type { LoaderFunction } from "react-router";

import { RouteLoaderData } from "@/pages/pages.d";
import { PER_PAGE } from "@/lib/constants";
import { sleep } from "@/lib/utils";
import { getList, makeQuery } from "@/lib/space";

import { SearchInput } from "@/components/Space/SearchInput";
import { IssueTable } from "@/components/Space/IssueTable";
import { IssuePagination } from "@/components/Space/IssuePagination";

const SpacePage: React.FC = () => {
  const { list, query, last, page } = useRouteLoaderData(
    "space"
  ) as RouteLoaderData;

  return (
    <div className="font-['DungGeunMo'] p-8">
      <div className="text-2xl text-left">Space</div>
      <div className="my-4 flex flex-row justify-between">
        <SearchInput />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={list}>
            {(list) => (
              <>
                <IssueTable list={list} />
              </>
            )}
          </Await>
        </Suspense>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={last}>
            {(last) => (
              <>
                <div className="w-full flex flex-col justify-evenly items-center mt-20">
                  {list && list?.length === 0 ? (
                    <>등록된 게시글이 없습니다.</>
                  ) : (
                    <IssuePagination last={last} page={page ?? 1} query={query} />
                  )}
                </div>
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

export default SpacePage;


export const loader : LoaderFunction = async ({request}) => {
  await sleep();

  const searchParams = new URL(request.url).searchParams;

  const query = {
    keyword: searchParams.get("keyword") ?? "",
    in: searchParams.get("in") ?? "title",
  };
  const page: number = Number(searchParams.get("page") ?? 1);


  const { list, last } = await getList(query, { page: page, per_page: PER_PAGE });

  return defer({
    list: list,
    query: query.keyword === "" ? "" : makeQuery(query),
    last: last ? last : page, // last 가 없는 경우, 현재 페이지가 last
    page: page,
  });
}