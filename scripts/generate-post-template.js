import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import { promises as fs } from "fs";
import path from "path";

dayjs.locale("ko");

async function generatePostTemplate(title, dateInput) {
  const now = dateInput ? dayjs(dateInput) : dayjs();

  if (!now.isValid()) {
    console.error("❌ Invalid date format. Use 'YYYY-MM-DD HH:mm'");
    process.exit(1);
  }

  const dateString = now.format("YYYYMMDD-HHmmss");
  const isoString = now.format("YYYY-MM-DDTHH:mm:ssZ");
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
