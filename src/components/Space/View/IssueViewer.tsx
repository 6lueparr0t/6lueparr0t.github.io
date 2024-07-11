import React from "react";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { SpaceProps } from "@/components/components.d";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export const IssueViewer: React.FC<SpaceProps> = ({ issue }) => {
  return (
    <div rel="space">
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
              rehypePlugins={[remarkGfm, rehypeRaw]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h1: ({ node, ...props }) => <h1 {...props} className="text-4xl font-bold" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold" />,
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : 'bash';
                  return (
                      <SyntaxHighlighter
                        language={language}
                        PreTag="div"
                        style={coldarkDark}
                        showLineNumbers
                        wrapLongLines
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                  );
                },
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
