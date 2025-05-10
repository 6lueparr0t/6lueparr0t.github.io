import { useLayoutEffect, useState } from "react";

import Giscus from "@giscus/react";
import { useParams } from "react-router";

import { formatDate } from "@/lib/date";

// Markdown 모듈 타입 정의
interface MarkdownModule {
  html: string;
  attributes: {
    title: string;
    date?: string;
    slug?: string;
  };
  toc?: any[];
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<MarkdownModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const rawModule = await import(`@posts/${slug}.md`);
        const postModule = rawModule as MarkdownModule;

        setPost(postModule);
      } catch (e: any) {
        setError(`Failed to load blog post "${slug}"`);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useLayoutEffect(() => {
    if (post?.html) {
      const container = document.querySelector(".blog-content"); // div에 className 추가해서 잡을 수 있게!
      const links = container?.querySelectorAll("a");

      links?.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });

      document.title = post.attributes.title || "Blog";
    }
  }, [post?.html]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found.</div>;

  return (
    <>
      <title>{post.attributes.title}</title>
      <div className="min-h-screen px-4 py-10">
        <main className="max-w-2xl mx-auto prose dark:prose-invert">
          <h1 className="text-3xl font-bold mb-2">{post.attributes.title}</h1>
          {post.attributes.date && (
            <p className="text-sm mb-6">
              {post?.attributes?.date
                ? formatDate(new Date(post.attributes.date), "yyyy-MM-dd HH:mm:ss")
                : ""}
            </p>
          )}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />
        </main>

        <div className="max-w-2xl mx-auto mt-16">
          <Giscus
            id="comments"
            repo={import.meta.env.VITE_APP_GISCUS_REPO}
            repoId={import.meta.env.VITE_APP_GISCUS_REPO_ID}
            category={import.meta.env.VITE_APP_GISCUS_CATEGORY}
            categoryId={import.meta.env.VITE_APP_GISCUS_CATEGORY_ID}
            mapping="title" // 포스트 제목으로 연결
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme="preferred_color_scheme"
            lang="ko"
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
};

export default BlogPost;
