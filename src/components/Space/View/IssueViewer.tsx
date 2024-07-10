import React from "react";
import { SpaceProps } from "@/components/components.d";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import dayjs from "dayjs";

export const IssueViewer: React.FC<SpaceProps> = ({ issue }) => {
  return (
    <div rel='space'>
      <div className="flex gap-16 items-center">
        <div className="flex items-center gap-4 ">
          <Avatar>
            <AvatarImage src={issue?.user.avatar_url} alt={`@${issue?.user.login}`} />
            <AvatarFallback>{issue?.user.login}</AvatarFallback>
          </Avatar>
          <div>{issue?.user.login}</div>
        </div>
        <div>{dayjs(issue?.created_at).format("YYYY-MM-DD HH:mm")}</div>
      </div>
      <div className="flex flex-col justify-between item-start">
        <div className="min-h-[50vh] border-y-4 border-gray-400 my-4 py-4 ">
          <div className="whitespace-pre-line">
            <Markdown
              rehypePlugins={[remarkGfm, rehypeHighlight, rehypeRaw]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h1: ({ node, ...props }) => <h1 {...props} className="text-4xl font-bold" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold" />,
              }}
            >
              {issue?.body}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
