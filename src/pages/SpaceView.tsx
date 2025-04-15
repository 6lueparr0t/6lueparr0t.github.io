import React, { Suspense, useEffect, useState } from "react";

import { ArrowTopRightOnSquareIcon, ChevronLeftIcon, LinkIcon } from "@heroicons/react/24/outline";
import { Await, Link, useLocation, useRouteLoaderData } from "react-router";
import { type LoaderFunction } from "react-router";

import { PER_PAGE } from "@/lib/constants";
import { getIssue, getList } from "@/lib/space";
import { get, sleep } from "@/lib/utils";

import Copy from "@/components/_common/Copy";
import { IssuePagination } from "@/components/space/IssuePagination";
import { IssueTable } from "@/components/space/IssueTable";
import { IssueComments } from "@/components/space/view/IssueComments";
import { IssueViewer } from "@/components/space/view/IssueViewer";
import { IssueViewerButtonGroup } from "@/components/space/view/IssueViewerButtonGroup";

import { RouteLoaderData } from "@/pages/pages.d";

const SpaceViewPage: React.FC = () => {
  const location = useLocation();
  const {
    title,
    issue,
    comments,
    list: defaultList,
    query,
    page: defaultPage,
    next: defaultNext,
    prev: defaultPrev,
  } = useRouteLoaderData("space-view") as RouteLoaderData;

  const siteUrl = `https://${import.meta.env.VITE_APP_GIT_REPO}${location.pathname}`;
  const issueUrl = `https://github.com/${import.meta.env.VITE_APP_GIT_OWNER}/${
    import.meta.env.VITE_APP_GIT_REPO
  }/issues/${issue?.number}`;

  const [page, setPage] = useState(defaultPage);
  const [list, setList] = useState(defaultList);
  const [next, setNext] = useState(defaultNext);
  const [prev, setPrev] = useState(defaultPrev);

  useEffect(() => {
    document.title = title || "6lueparr0t's Home";
  }, [title]);

  return (
    <div className="p-8 w-full lg:w-3/4 m-auto">
      <Link to={`/space`} className="inline-block">
        <ChevronLeftIcon className="w-[24px] h-[24px]" />
      </Link>
      <div className="flex justify-between items-center text-2xl text-left my-8">
        <span className="mr-4">{title}</span>
        <div className="flex">
          <span className="text-xl mr-4" title={siteUrl}>
            <Copy title="" icon={<LinkIcon className="w-[24px] h-[24px]" />}>
              {siteUrl}
            </Copy>
          </span>
          <span className="text-xl" title={issueUrl}>
            <a href={issueUrl} target="_blank">
              <ArrowTopRightOnSquareIcon className="w-[24px] h-[24px]" />
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
            <IssueTable list={list} issue={issue} page={page || 1} headless={true} />
          </Await>
        </Suspense>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={list}>
            {() => (
              <div className="w-full flex flex-col justify-evenly items-center pt-8">
                <IssuePagination
                  issueNumber={issue?.number}
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

  const page = Number(searchParams.get("page")) || 1;

  try {
    const { issue, comments } = await getIssue({}, issueNumber);
    const title = get(issue, "title");

    const { list, next, prev } = await getList(query, { page, per_page: PER_PAGE });

    return Response.json({
      title,
      issue,
      comments,
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
