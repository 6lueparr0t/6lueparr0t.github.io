import { Octokit } from "octokit";

import { PER_PAGE } from "@/lib/constants";
import { get, isEmptyObject, pick } from "@/lib/utils";

import { Issue } from "@/components/components";

const repo = import.meta.env.VITE_APP_GIT_REPO;
const owner = import.meta.env.VITE_APP_GIT_OWNER;
const auth = import.meta.env.VITE_APP_GIT_TOKEN_CLASSIC;

const octokit = new Octokit({
  auth: auth,
});

export const makeQuery = (query: object, char: string = "&"): string => {
  // 입력 : { name: 'John', age: 30 }; // 출력: [['name', 'John'], ['age', 30]]
  return (
    char +
    Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&")
  );
};

// Github API 를 사용하여 목록을 가져옴
export const getList = async (
  query: { keyword?: string; in: string } = { keyword: "", in: "title" },
  option: { page?: number; per_page?: number } = {}
): Promise<{
  list: Issue[];
  next: number;
  prev: number;
  status?: number;
  message?: object;
}> => {
  let list: Issue[] = [];
  let next = 0;
  let prev = 0;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any;

    if (get(query, "keyword") !== "") {
      response = await search(query, option);

      if (response.status === 200) {
        const pagination = parsePagination(response.headers.link);
        next = pagination.next;
        prev = pagination.prev;
        list = response.data.items.map((item: object) => parseData(item));
      }
    } else {
      response = await getGithubIssue(option);

      if (response.status === 200) {
        const pagination = parsePagination(response.headers.link);
        next = pagination.next;
        prev = pagination.prev;
        list = response.data.map((item: object) => parseData(item));
      }
    }

    if (response.status !== 200) throw new Error("Could not fetch details for selected event.");
  } catch (error) {
    return {
      list: [],
      next: 0,
      prev: 0,
      status: 500,
      message: error ?? "",
    };
  }

  return { list, next, prev };
};

// Github API 를 사용하여 이슈를 가져옴
export const getIssue = async (
  option: { page?: number; per_page?: number } = {},
  issueNumber: number
): Promise<{
  issue: Issue;
  comments?: Issue[];
  status?: number;
  message?: object;
}> => {
  let issue: Issue = {
    number: 0,
    title: "",
    body: "",
    created_at: "",
    updated_at: "",
    node_id: "",
    user: {
      avatar_url: "",
      login: "",
    },
  };
  let comments: Issue[] = [];

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any;
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
      comments: [],
      status: 500,
      message: error ?? "",
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any;
    // eslint-disable-next-line prefer-const
    response = await getGithubIssueComment(issueNumber);

    if (response.status === 200) {
      comments = parseDataForComments(response.data);
    } else {
      throw new Error("Could not fetch details for selected event.");
    }
  } catch (error) {
    return {
      issue: issue,
      comments: comments,
      status: 500,
      message: error ?? "",
    };
  }

  return { issue: issue, comments: comments };
};

// Octokit.js
// https://github.com/octokit/core.js#readme
export const getGithubIssue = async (
  option: { per_page?: number } = { per_page: PER_PAGE },
  issueNumber: number = 0
): Promise<unknown> => {
  const issuePath: string = issueNumber ? "/" + String(issueNumber) : "";

  let optionQuery: string = "";
  if (!isEmptyObject(option)) {
    optionQuery = makeQuery(option, "?");
  }

  const response = await octokit.request(
    `GET /repos/${owner}/${repo}/issues${issuePath}${optionQuery ?? ""}`,
    {
      owner: owner,
      repo: repo,
      per_page: 10,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response;
};

// https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments
export const getGithubIssueComment = async (issueNumber: number = 0): Promise<unknown> => {
  const issuePath: string = issueNumber ? "/" + String(issueNumber) : "";

  const response = await octokit.request(
    `GET /repos/${owner}/${repo}/issues${issuePath}/comments`,
    {
      owner: owner,
      repo: repo,
      issue_number: issueNumber,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response;
};

export const search = async (
  query: { keyword?: string; in: string },
  option: object = {}
): Promise<unknown> => {
  let qQuery: string = "q=";
  if (!isEmptyObject(query)) {
    qQuery += encodeURIComponent(`${query.keyword} in:${query.in} repo:${owner}/${repo}`);
  }

  let optionQuery: string = "";
  if (!isEmptyObject(option)) {
    optionQuery = makeQuery(option);
  }

  const response = await octokit.request(
    `GET /search/issues?${qQuery ?? ""}${optionQuery ?? ""}&advanced_search=true`,
    {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response;
};

export const parseData = (item: object) => ({
  ...pick(["number", "title", "body", "created_at", "updated_at", "node_id"], item as Issue),
  user: pick(
    ["avatar_url", "login", "site_admin"],
    get(item, "user", {}) as { avatar_url: string; login: string; site_admin: boolean }
  ),
});

export const parseDataForComments = (item: object[]) => {
  return item.map((comment) => {
    return {
      ...pick(["number", "title", "body", "created_at", "updated_at", "node_id"], comment as Issue),
      user: pick(
        ["avatar_url", "login", "site_admin"],
        get(comment, "user", {}) as { avatar_url: string; login: string; site_admin: boolean }
      ),
    };
  });
};

export const parsePagination = (linkHeader?: string): { next: number; prev: number } => {
  if (!linkHeader) return { next: 0, prev: 0 };

  const links = linkHeader.split(",");

  const nextLink = links.find((l) => l.includes('rel="next"'));
  const prevLink = links.find((l) => l.includes('rel="prev"'));

  let next = 0;
  if (nextLink) {
    const match = nextLink.match(/[?&]page=(\d+)/);
    next = match ? Number(match[1]) : 1;
  }

  let prev = 0;
  if (prevLink) {
    const match = prevLink.match(/[?&]page=(\d+)/);
    prev = match ? Number(match[1]) : 1;
  }

  return { next, prev };
};
