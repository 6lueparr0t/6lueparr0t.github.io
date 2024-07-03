import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function GET(context) {
  return rss({
    title: "6lueparr0t's Portfolio",
    description: "Web Development, Frontend, Backend, DevOps, Tech News, Trending and more.",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./posts/**/*.md")),
    customData: `<language>ko-kr</language>`,
  });
}
