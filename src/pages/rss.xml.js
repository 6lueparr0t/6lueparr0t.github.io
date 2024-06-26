import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function GET(context) {
  return rss({
    title: "개발자 발가락",
    description: "개발자 발가락",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./post/**/*.md")),
    customData: `<language>ko-kr</language>`,
  });
}
