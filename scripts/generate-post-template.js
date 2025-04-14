import { promises as fs } from "fs";
import path from "path";
import { format, formatISO, parse, isValid } from "date-fns";
import { ko } from "date-fns/locale";

async function generatePostTemplate(title, dateInput) {
  // 날짜 파싱
  let now;
  if (dateInput) {
    now = parse(dateInput, "yyyy-MM-dd HH:mm", new Date(), { locale: ko });
  } else {
    now = new Date();
  }

  if (!isValid(now)) {
    console.error("❌ Invalid date format. Use 'YYYY-MM-DD HH:mm'");
    process.exit(1);
  }

  const dateString = format(now, "yyyyMMdd-HHmmss");
  const isoString = formatISO(now);
  const safeTitle = title.replace(/\s+/g, "-").toLowerCase();
  const filename = `${dateString}-${safeTitle}.md`;
  const filepath = path.join(process.cwd(), "posts", filename);
  const slug = filename.replace(".md", "");

  const content = `---
title: ${title}
date: ${isoString}
slug: ${slug}
---

## Content

Write your content here.
`;

  try {
    await fs.writeFile(filepath, content, "utf8");
    console.log(`Generated post template: ${filepath}`);
  } catch (err) {
    console.error("Failed to generate post template:", err);
  }
}

// get args
const [title, ...rest] = process.argv.slice(2);

if (!title) {
  console.error("Please provide a title for the post.");
  process.exit(1);
}

const dateInput = rest.length > 0 ? rest.join(" ") : undefined;

generatePostTemplate(title, dateInput);
