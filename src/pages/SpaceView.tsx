import React, { Suspense, useEffect, useState } from "react";
import { Link, json, Await, defer, useRouteLoaderData, useLocation } from "react-router-dom";
import { type LoaderFunction } from "react-router";

import { RouteLoaderData } from "@/pages/pages.d";
import { sleep, get } from "@/lib/utils";
import { getIssue, getList } from "@/lib/space";
import { PER_PAGE } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { IssueViewer } from "@/components/space/view/IssueViewer";
import { IssueViewerButtonGroup } from "@/components/space/view/IssueViewerButtonGroup";
import { IssueComments } from "@/components/space/view/IssueComments";
import { IssueTable } from "@/components/space/IssueTable";
import { IssuePaginationWithState } from "@/components/space/IssuePagination";

import Copy from "@/components/_common/Copy";
import { LinkIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const SpaceViewPage: React.FC = () => {
  const location = useLocation();
  const { title, issue, comments, list:defaultList, query, last:defaultLast, page:defaultPage } = useRouteLoaderData("space-view") as RouteLoaderData;

  const siteUrl = `https://${import.meta.env.VITE_APP_GIT_REPO}${location.pathname}`;
  const issueUrl = `https://github.com/${import.meta.env.VITE_APP_GIT_OWNER}/${
    import.meta.env.VITE_APP_GIT_REPO
  }/issues/${issue?.number}`;

  const [page, setPage] = useState(defaultPage);
  const [list, setList] = useState(defaultList);
  const [last, setLast] = useState(defaultLast);

  useEffect(() => {
    document.title = title || "6lueparr0t's Home";
  }, [title]);

  return (
    <div className="p-8 w-full lg:w-3/4 m-auto">
      <Button variant="ghost" className="p-0" title="back">
        <Link to={`/space`}>
          <ChevronLeftIcon className="w-[24px] h-[24px]" />
        </Link>
      </Button>
      <div className="flex justify-between items-center text-2xl text-left my-8">
        <span className="mr-4">{title}</span>
        <div className="flex">
          <span className="text-xl mr-4" title={siteUrl}>
            <Copy title="">{siteUrl}</Copy>
          </span>
          <span className="text-xl" title={issueUrl}>
            <a href={issueUrl} target="_blank">
              <LinkIcon className="w-[24px] h-[24px]" />
            </a>
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={issue}>
            {(issue) => (
              <>
                <IssueViewer issue={issue} />
                <IssueViewerButtonGroup issue={issue} />
                <IssueComments comments={comments} />
              </>
            )}
          </Await>
        </Suspense>
      </div>
      <div id="space-bottom" className="flex flex-col justify-center items-center rounded-lg">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={list}>
            <IssueTable list={list} page={page || 1} headless={true} />
          </Await>
        </Suspense>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Await resolve={last}>
              {(last) => (
                <>
                  <div className="w-full flex flex-col justify-evenly items-center pt-8">
                    <IssuePaginationWithState
                      issueNumber={issue?.number}
                      last={last}
                      page={page || 1}
                      query={query || { in: "title" }}
                      setPage={setPage}
                      setList={setList}
                      setLast={setLast}
                    />
                  </div>
                </>
              )}
            </Await>
          </Suspense>
      </div>
    </div>
  );
};

export default SpaceViewPage;

// eslint-disable-next-line react-refresh/only-export-components
export const loader: LoaderFunction = async ({ params, request }) => {
  await sleep();

  const issueNumber: number = Number(params?.issueNumber ?? 0);
  const searchParams = new URL(request.url).searchParams;

  const query = {
    keyword: searchParams.get("keyword") ?? "",
    in: searchParams.get("in") ?? "title",
  };

  const page = Number(searchParams.get("page")) ?? 1;

  try {
    const { issue, comments } = await getIssue({}, issueNumber);
    const title = get(issue, "title");

    const { list, last } = await getList(query, { page: page, per_page: PER_PAGE });

    return defer({
      title: title,
      issue: issue,
      comments: comments,
      list: list,

      query: query,
      last: Math.max(last, page), // last 가 없는 경우, 현재 페이지가 last
      page: page,
    });
  } catch (error) {
    throw json({ message: error }, { status: 500 });
  }
};
