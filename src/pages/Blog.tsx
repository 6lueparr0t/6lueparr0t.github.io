import { useEffect, useRef, useState } from "react";

import { Link } from "react-router";

import modalStore from "@/store/modal";

import { formatDate } from "@/lib/date";

import Copy from "@/components/common/Copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MarkdownModule {
  html: string;
  attributes: {
    title: string;
    date?: string;
    slug?: string;
  };
}

interface PostInfo {
  slug: string;
  title: string;
  date?: string;
}

const postFiles = import.meta.glob<{ html: string; attributes: MarkdownModule["attributes"] }>(
  "../../posts/*.md",
  { eager: true }
);

function BlogPage() {
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { pushModals } = modalStore();

  useEffect(() => {
    const loadedPosts = Object.entries(postFiles)
      .map(([path, module]) => {
        const slug = path.split("/").pop()?.replace(".md", "") || "";
        const { title, date } = module.attributes;
        return { slug, title, date };
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });

    setPosts(loadedPosts);
    document.title = "Blog";
  }, []);

  const handleNewPost = () => {
    const url = `https://github.com/${import.meta.env.VITE_APP_GIT_OWNER}/${import.meta.env.VITE_APP_GIT_REPO}/new/main/posts`;
    window.open(url, "_blank", "noopener,noreferrer");

    // 새창이 성공적으로 열렸을 때 Modal 띄우기
    const now = new Date();
    const filename = formatDate(now, "yyyyMMdd-HHmmss-") + ".md";
    const isoString = now.toISOString();
    const slug = formatDate(now, "yyyyMMdd-HHmmss-").slice(0, -1); // 마지막 하이픈 제거

    const NewPostModalContent = () => {
      const { popModals } = modalStore();
      const [filenameValue, setFilenameValue] = useState(filename);
      const [content, setContent] = useState(
        `---\ntitle: \ndate: ${isoString}\nslug: ${slug}\n---\n`
      );

      const handleClose = () => {
        popModals();
      };

      return (
        <div className="flex flex-col gap-4 w-full p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Filename</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={filenameValue}
                onChange={(e) => setFilenameValue(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="sm" asChild>
                <Copy id="filename" iconOnly>
                  {filenameValue}
                </Copy>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Content</label>
            <div className="flex flex-col gap-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="border border-input rounded-md px-3 py-2 text-sm font-mono resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={handleClose} variant="default">
              닫기
            </Button>
          </div>
        </div>
      );
    };

    pushModals({
      message: "New Post",
      type: "confirm",
      prevRef: null,
      optionComponent: <NewPostModalContent />,
    });
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <main className="max-w-2xl mx-auto text-left">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog</h1>
          <Button ref={buttonRef} onClick={handleNewPost} variant="outline">
            new post
          </Button>
        </div>
        {posts.length > 0 ? (
          <ul className="list-none flex flex-col gap-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="flex items-baseline hover:underline">
                  <span className="text-sm w-[130px] shrink-0">
                    <time
                      dateTime={post.date}
                      title={
                        post.date ? formatDate(new Date(post.date), "yyyy-MM-dd HH:mm:ss") : ""
                      }
                    >
                      {post.date ? post.date.split("T")[0] : "No date"}
                    </time>
                  </span>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>글이 없습니다.</p>
        )}
      </main>
    </div>
  );
}

export default BlogPage;
