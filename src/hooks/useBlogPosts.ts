import { useEffect, useState } from "react";

interface MarkdownModule {
  html: string;
  attributes: {
    title: string;
    date?: string;
    slug?: string;
  };
}

export interface PostInfo {
  slug: string;
  title: string;
  date?: string;
}

const postFiles = import.meta.glob<{ html: string; attributes: MarkdownModule["attributes"] }>(
  "../../posts/*.md",
  { eager: true }
);

export function useBlogPosts() {
  const [posts, setPosts] = useState<PostInfo[]>([]);

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
  }, []);

  return posts;
}
