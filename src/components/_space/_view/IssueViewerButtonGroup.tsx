import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { SpaceProps } from "@/components/components.d";

export const IssueViewerButtonGroup: React.FC<SpaceProps> = ({ issue }) => {
  return (
    <>
      <div className="my-4 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4">
          <div className="flex w-full max-w-sm space-x-2">
            <a href={`https://github.com/${import.meta.env.VITE_APP_GIT_OWNER}/${import.meta.env.VITE_APP_GIT_REPO}/issues/${issue?.number}`} target="_blank">
              <Button>수정</Button>
            </a>
          </div>
        </div>
        <div>
          <Link to={`/space`}>
            <Button>목록</Button>
          </Link>
        </div>
      </div>
    </>
  );
};
