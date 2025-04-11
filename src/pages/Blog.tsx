import { useEffect, useState } from "react";
import { Link } from "react-router";

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

  useEffect(() => {
    const loadedPosts = Object.entries(postFiles)
      .map(([path, module]) => {
        const slug = path.split("/").pop()?.replace(".md", "") || "";
        const { title, date } = module.attributes;
        return { slug, title, date };
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || "").getTime();
        const dateB = new Date(b.date || "").getTime();
        return dateB - dateA;
      });

    setPosts(loadedPosts);
    document.title = "Blog";
  }, []);

  return (
    <div className="min-h-screen px-4 py-10">
      <main className="max-w-2xl mx-auto text-left">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        <ul className="list-none space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="flex items-baseline space-x-4">
              <span className="text-sm w-[130px] shrink-0">
                <time dateTime={post.date}>
                  {post.date ? new Date(post.date).toISOString().split("T")[0] : "No date"}
                </time>
              </span>
              <Link
                to={`/blog/${post.slug}`}
                className="text-sky-300 hover:underline visited:text-purple-400"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default BlogPage;
