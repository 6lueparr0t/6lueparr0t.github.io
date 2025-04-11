import { useEffect, useState } from "react";
import { useParams } from "react-router";

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

  useEffect(() => {
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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found.</div>;

  return (
    <div className="min-h-screen px-4 py-10">
      <main className="max-w-2xl mx-auto prose dark:prose-invert">
        <h1 className="text-3xl font-bold mb-2">{post.attributes.title}</h1>
        {post.attributes.date && (
          <p className="text-sm mb-6">
            {new Date(post.attributes.date).toISOString().split("T")[0]}
          </p>
        )}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </main>
    </div>
  );
};

export default BlogPost;
