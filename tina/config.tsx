import { defineConfig, type Form, type TinaCMS, Input } from "tinacms";
import dayjs from "dayjs";
import React from "react";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  // clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  clientId: null,
  // Get this from tina.io
  // token: process.env.TINA_TOKEN,
  token: null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "media",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/pages/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Date Posted",
            ui: {
              dateFormat: "YYYY-MM-DD",
              parse: (value: any) => value && value.format("YYYY-MM-DD"),
            },
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            label: "Tags",
            name: "tags",
            type: "string",
            ui: {
              // format: (value: any) => value,
              // parse: (value: any) => value,
              component: ({ input }) => {
                return (
                  <>
                    <label htmlFor="tags">Tags</label>
                    <Input {...input} placeholder="Separate with commas(,)" />
                  </>
                );
              },
            },
          },
        ],
        ui: {
          beforeSubmit: async ({
            form,
            cms,
            values,
          }: {
            form: Form;
            cms: TinaCMS;
            values: Record<string, any>;
          }) => {
            if (form.crudType === "create") {
              return {
                ...values,
              };
            } else {
              return {
                ...values,
              };
            }
          },
        },
      },
    ],
  },
});
