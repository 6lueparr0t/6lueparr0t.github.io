import { useEffect, useRef } from "react";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import modalStore from "@/store/modal";

import { useBlogPosts } from "@/hooks/useBlogPosts";

import { formatDate } from "@/lib/date";

import NewPostModal from "@/components/blog/NewPostModal";
import { Button } from "@/components/ui/button";

function BlogPage() {
  const posts = useBlogPosts();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { pushModals } = modalStore();

  useEffect(() => {
    document.title = "Blog";
  }, []);

  const handleNewPost = () => {
    const now = new Date();
    const filename = formatDate(now, "yyyyMMdd-HHmmss-") + ".md";
    const isoString = now.toISOString();
    const slug = formatDate(now, "yyyyMMdd-HHmmss-").slice(0, -1); // 마지막 하이픈 제거

    pushModals({
      message: "New Post",
      type: "confirm",
      prevRef: null,
      optionComponent: <NewPostModal filename={filename} isoString={isoString} slug={slug} />,
    });
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <main className="max-w-2xl mx-auto text-left">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog</h1>
          <Button ref={buttonRef} onClick={handleNewPost} variant="outline" size="icon">
            <PencilSquareIcon className="h-4 w-4" />
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
