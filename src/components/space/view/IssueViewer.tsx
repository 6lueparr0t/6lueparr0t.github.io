import React, { useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Markdown from "react-markdown";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { formatDate } from "@/lib/date";

import { SpaceProps } from "@/components/components.d";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SyntaxHighlighter = Prism as any as React.FC<SyntaxHighlighterProps>;

export const IssueViewer: React.FC<SpaceProps> = ({ issue }) => {
  return (
    <div rel="space" className="border-t-4 border-gray-400">
      <div className="flex gap-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={issue?.user.avatar_url} alt={`@${issue?.user.login}`} />
            <AvatarFallback>{issue?.user.login}</AvatarFallback>
          </Avatar>
          <div>{issue?.user.login}</div>
        </div>
        <div className="text-right">
          {issue?.created_at ? formatDate(new Date(issue.created_at), "yyyy-MM-dd HH:mm:ss") : ""}
        </div>
      </div>
      <div className="flex flex-col justify-between item-start">
        <div className="min-h-[50vh] my-4">
          <Markdown
            rehypePlugins={[remarkGfm, rehypeRaw]}
            components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              p: ({ node, ...props }) => <p {...props} className="leading-6" />,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h1: ({ node, ...props }) => <h1 {...props} className="text-4xl font-bold" />,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold" />,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-bold" />,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="underline underline-offset-4 decoration-1 dark:hover:text-blue-400"
                />
              ),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="p-4 italic border-l-4 border-gray-500 quote" />
              ),
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6" />,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              li: ({ node, ...props }) => <li {...props} className="my-4" />,
              code({ className, children }) {
                const [copied, setCopied] = useState(false);
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "bash";

                const handleCopy = () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                };
                return (
                  <div className="relative">
                    <CopyToClipboard text={String(children)} onCopy={handleCopy}>
                      <button
                        className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded hover:bg-gray-600 opacity-80 transition duration-200"
                        aria-label="Copy code"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </CopyToClipboard>
                    <SyntaxHighlighter
                      language={language}
                      PreTag="div"
                      style={coldarkDark}
                      showLineNumbers
                      wrapLongLines={false}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                );
              },
            }}
          >
            {issue?.body}
          </Markdown>
        </div>
      </div>
    </div>
  );
};
