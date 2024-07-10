import fp from "lodash/fp";
import { Octokit } from "octokit";
import { PER_PAGE } from "@/lib/constants";
import { Issue } from "@/components/components";

const repo = import.meta.env.VITE_APP_GIT_REPO;
const owner = import.meta.env.VITE_APP_GIT_OWNER;
const auth = import.meta.env.VITE_APP_GIT_TOKEN;

const octokit = new Octokit({
  auth: auth,
});

export const makeQuery = (query: object) =>
  "&" +
  fp.pipe(
    fp.toPairs, // 입력 : { name: 'John', age: 30 }; // 출력: [['name', 'John'], ['age', 30]]
    fp.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`),
    fp.join("&")
  )(query);

export const getList = async (
  query: { keyword: string; in: string } = { keyword: "", in: "title" },
  option: { page?: number; per_page?: number } = {}
): Promise<{
  list: Issue[];
  last: number;
  status?: number;
  message?: object;
}> => {
  let list;

  let last: number = 0;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response : any;

    if (fp.get("keyword", query) !== "") {
      response = await search(query, option);

      if (response.status === 200) {
        last = parseLastPage(response);
        list = response.data.items.map((item: object) => parseData(item));
      }
    } else {
      response = await getGithubIssue(option);

      if (response.status === 200) {
        last = parseLastPage(response);
        list = response.data.map((item: object) => parseData(item));
      }
    }

    if (response.status !== 200) throw new Error("Could not fetch details for selected event.");
  } catch (error) {
    return {
      list: [],
      last: 0,
      status: 500,
      message: error ?? "",
    };
  }

  return { list: list, last: last };
};

export const getIssue = async (
  option: { page?: number; per_page?: number } = {},
  issueNumber: number
): Promise<{
  issue: Issue;
  status?: number;
  message?: object;
}> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let issue: any = {};

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response : any;
    // eslint-disable-next-line prefer-const
    response = await getGithubIssue(option, issueNumber);

    if (response.status === 200) {
      issue = parseData(response.data);
    } else {
      throw new Error("Could not fetch details for selected event.");
    }
  } catch (error) {
    return {
      issue: issue,
      status: 500,
      message: error ?? "",
    };
  }

  return { issue: issue };
};

// Octokit.js
// https://github.com/octokit/core.js#readme
export const getGithubIssue = async (
  option: { per_page?: number } = { per_page: PER_PAGE },
  issueNumber: number = 0
): Promise<unknown> => {
  const issuePath: string = issueNumber ? "/" + String(issueNumber) : "";

  let optionQuery: string = "";
  if (!fp.isEqual(option, {})) {
    optionQuery =
      "?" +
      fp.pipe(
        fp.toPairs, // 입력 : { name: 'John', age: 30 }; // 출력: [['name', 'John'], ['age', 30]]
        fp.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`),
        fp.join("&")
      )(option);
  }

  const response = await octokit.request(
    `GET /repos/${owner}/${repo}/issues${issuePath}${optionQuery ?? ""}`,
    {
      owner: owner,
      repo: repo,
      per_page: option.per_page,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response;
};

export const search = async (
  query: { keyword: string; in: string },
  option: object = {}
): Promise<unknown> => {
  let qQuery: string = "q=";
  if (!fp.isEqual(query, {})) {
    qQuery += encodeURIComponent(`${query.keyword} in:${query.in} repo:${owner}/${repo}`);
  }

  let optionQuery: string = "";
  if (!fp.isEqual(option, {})) {
    optionQuery = makeQuery(option);
  }

  const response = await octokit.request(`GET /search/issues?${qQuery ?? ""}${optionQuery ?? ""}`, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return response;
};

export const parseData = (item: object) => ({
  ...fp.pick(["number", "title", "body", "created_at", "updated_at", "node_id"], item),
  user: fp.pick(["avatar_url", "login"], fp.get("user", item)),
});

export const parseLastPage = (props: {
  data: { total_count?: number };
  headers: { link?: string };
}): number =>
  Number(
    fp.pipe(
      fp.find((link: string) => link.includes('rel="last"')),
      fp.replace(/.*[?&]page=(\d+).*/, "$1"),
      (result: number) => result || 0
    )(fp.split(",", props.headers.link))
  );
