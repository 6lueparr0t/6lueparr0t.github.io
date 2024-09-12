import React from "react";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { SpaceProps } from "@/components/components.d";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const IssueComments: React.FC<SpaceProps> = ({ comments }) => {
  return (
    <div className="space-y-4 border-t-4 border-gray-400">
      {comments?.map((comment) => (
        <div key={comment.node_id} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment?.user.avatar_url} alt={`@${comment?.user.login}`} />
                <AvatarFallback>{comment?.user.login}</AvatarFallback>
              </Avatar>
              <div className="font-medium">{comment?.user.login}</div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {dayjs(comment?.created_at).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
          <div className="mt-4">
            <Markdown
              rehypePlugins={[remarkGfm, rehypeRaw]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-bold" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-bold" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                a: ({ node, ...props }) => (
                  <a {...props} className="text-blue-600 dark:text-blue-400 underline" />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    {...props}
                    className="p-4 italic border-l-4 border-gray-500 dark:border-gray-400 bg-gray-200 dark:bg-gray-700"
                  />
                ),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4" />,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4" />,
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const language = match ? match[1] : "bash";
                  return (
                    <SyntaxHighlighter
                      language={language}
                      PreTag="div"
                      style={coldarkDark}
                      showLineNumbers
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                },
              }}
            >
              {comment?.body}
            </Markdown>
          </div>
        </div>
      ))}
    </div>
  );
};
