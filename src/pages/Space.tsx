import React, { Suspense, useEffect, useLayoutEffect, useState } from "react";

import { Await, useRouteLoaderData } from "react-router";
import type { LoaderFunction } from "react-router";
import { NavLink } from "react-router";

import { PER_PAGE } from "@/lib/constants";
import { getList } from "@/lib/space";
import { sleep } from "@/lib/utils";

import { IssuePagination } from "@/components/space/IssuePagination";
import { IssueTable } from "@/components/space/IssueTable";
import { SearchInput } from "@/components/space/SearchInput";

import { RouteLoaderData } from "@/pages/pages.d";

const SpacePage: React.FC = () => {
  const {
    list: defaultList,
    query,
    page: defaultPage,
    next: defaultNext,
    prev: defaultPrev,
  } = useRouteLoaderData("space") as RouteLoaderData;

  const [page, setPage] = useState(defaultPage);
  const [list, setList] = useState(defaultList);
  const [next, setNext] = useState(defaultNext);
  const [prev, setPrev] = useState(defaultPrev);

  useEffect(() => {
    document.title = "space";
  }, []);

  useLayoutEffect(() => {
    if (query.in && query.keyword) {
      document.title = `${query.in}:${query.keyword}`;
    }

    setPage(defaultPage);
    setList(defaultList);
  }, [query.in, query.keyword, defaultPage, defaultList]);

  return (
    <div className="p-8 min-h-[calc(100vh-4.2rem)] flex flex-col justify-between">
      <div id="space-top">
        <div className="text-2xl text-left">
          <NavLink to={"/space"}>Space</NavLink>
        </div>
        <div className="text-base text-left">
          <a
            href={`https://github.com/${import.meta.env.VITE_APP_GIT_OWNER}/${
              import.meta.env.VITE_APP_GIT_REPO
            }/issues`}
            target="_blank"
            rel="noreferrer"
          >
            Github Issues{" "}
          </a>
        </div>
        <SearchInput query={query} />
        <div className="flex flex-col justify-center items-center">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Await resolve={list}>
              <IssueTable list={list} page={page} />
            </Await>
          </Suspense>
        </div>
      </div>
      <div id="space-bottom">
        <div className="flex flex-col justify-center items-center">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Await resolve={list}>
              {() => (
                <>
                  <div className="w-full flex flex-col justify-evenly items-center mt-20">
                    <IssuePagination
                      page={page || 1}
                      next={next || 0}
                      prev={prev || 0}
                      query={query || { in: "title" }}
                      setPage={setPage}
                      setList={setList}
                      setNext={setNext}
                      setPrev={setPrev}
                    />
                  </div>
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SpacePage;

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ request }) => {
  await sleep();

  const searchParams = new URL(request.url).searchParams;

  const query = {
    keyword: searchParams.get("keyword") ?? "",
    in: searchParams.get("in") ?? "title",
  };

  try {
    const page: number = Number(searchParams.get("page") || 1);

    const { list, next, prev } = await getList(query, { page: page, per_page: PER_PAGE });

    return Response.json({
      list,
      query,
      next,
      prev,
      page,
    });
  } catch (error) {
    throw Response.json({ message: error }, { status: 500 });
  }
};
