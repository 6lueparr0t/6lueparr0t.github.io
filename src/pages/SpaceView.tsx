import React, { Suspense, useEffect } from "react";
import { json, Await, defer, useNavigate, useRouteLoaderData } from "react-router-dom";
import type { LoaderFunction } from "react-router";

import { RouteLoaderData } from "@/pages/pages.d";
import { sleep, get } from "@/lib/utils";
import { getIssue } from "@/lib/space";

import { IssueViewer } from "@/components/Space/View/IssueViewer";
import { IssueViewerButtonGroup } from "@/components/Space/View/IssueViewerButtonGroup";

const SpaceViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { title, issue } = useRouteLoaderData("space-view") as RouteLoaderData;

  useEffect(() => {
    // if(isUndefined(title)) navigate(`/space`);
    document.title = title ?? "";
  }, [navigate, title]);

  return (
    <div className="p-8 w-full sm:w-3/4 lg:w-1/2 m-auto">
      <div className="text-2xl text-left my-8">{title}</div>
      <div className="flex flex-col">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={issue}>
            {(issue) => (
              <>
                <IssueViewer issue={issue} />
                <IssueViewerButtonGroup issue={issue} />
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
export const loader: LoaderFunction = async ({ params }) => {
  await sleep();

  const issueNumber: number = Number(params?.issueNumber ?? 0);

  try {
    const { issue } = await getIssue({}, issueNumber);
    const title = get(issue, "title");

    return defer({
      title: title,
      issue: issue,
    });
  } catch (error) {
    throw json({ message: error }, { status: 500 });
  }
};
