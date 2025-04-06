import { PER_PAGE } from "@/lib/constants";
import { get } from "@/lib/utils";
import { graphql } from "@octokit/graphql";
import { Octokit } from "octokit";

import { Issue } from "@/components/components";

const repo = import.meta.env.VITE_APP_GIT_REPO;
const owner = import.meta.env.VITE_APP_GIT_OWNER;
const auth = import.meta.env.VITE_APP_GIT_TOKEN;

const octokit = new Octokit({ auth });
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${auth}`,
  },
});

type SearchIssuesResponse = {
  search: {
    issueCount: number;
    nodes: {
      number: number;
      title: string;
      body: string;
      createdAt: string;
      updatedAt: string;
      id: string;
      author: {
        login: string;
        avatarUrl: string;
      } | null;
    }[];
  };
};

export const getList = async (
  query: { keyword?: string; in: string } = { keyword: "", in: "title" },
  option: { first?: number; page?: number; per_page?: number } = {}
): Promise<{
  list: Issue[];
  last: number;
  status?: number;
  message?: object;
}> => {
  try {
    if (get(query, "keyword") !== "") {
      const response = await searchWithGraphQL(query, option);
      return {
        list: response.list,
        last: Math.ceil(response.total / (option.per_page ?? PER_PAGE)),
      };
    } else {
      const response = await getIssue(option);
      if (response.status === 200) {
        return {
          list: response.data.map(parseData),
          last: parseLastPage(response),
        };
      } else {
        throw new Error("Could not fetch issue list");
      }
    }
  } catch (error) {
    return {
      list: [],
      last: 0,
      status: 500,
      message: error ?? "",
    };
  }
};

export const searchWithGraphQL = async (
  query: { keyword?: string; in: string },
  option: { first?: number } = { first: PER_PAGE }
): Promise<{ list: Issue[]; total: number }> => {
  const { keyword = "", in: searchIn = "title" } = query;
  const { first = PER_PAGE } = option;

  const q = `${keyword} in:${searchIn} repo:${owner}/${repo} is:issue`;

  const response = await graphqlWithAuth<SearchIssuesResponse>(
    `query($q: String!, $first: Int!) {
      search(query: $q, type: ISSUE, first: $first) {
        issueCount
        nodes {
          ... on Issue {
            number
            title
            body
            createdAt
            updatedAt
            id
            author {
              login
              avatarUrl
            }
          }
        }
      }
    }`,
    {
      q,
      first,
    }
  );

  const list: Issue[] = response.search.nodes.map((node: any) => ({
    number: node.number,
    title: node.title,
    body: node.body,
    created_at: node.createdAt,
    updated_at: node.updatedAt,
    node_id: node.id,
    user: {
      login: node.author?.login ?? "",
      avatar_url: node.author?.avatarUrl ?? "",
    },
  }));

  return {
    list,
    total: response.search.issueCount,
  };
};

export const getIssue = async (
  option: { per_page?: number } = { per_page: PER_PAGE },
  issueNumber: number = 0
): Promise<any> => {
  const issuePath: string = issueNumber ? "/" + String(issueNumber) : "";
  const query = new URLSearchParams(option as Record<string, string>).toString();
  const response = await octokit.request(
    `GET /repos/${owner}/${repo}/issues${issuePath}?${query}`,
    {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return response.data;
};

export const parseData = (item: any): Issue => ({
  number: item.number,
  title: item.title,
  body: item.body,
  created_at: item.created_at,
  updated_at: item.updated_at,
  node_id: item.node_id,
  user: {
    login: item.user?.login ?? "",
    avatar_url: item.user?.avatar_url ?? "",
  },
});

export const parseLastPage = (props: {
  data: { total_count?: number };
  headers: { link?: string };
}): number => {
  if (!props.headers.link) return 0;
  const lastLink = props.headers.link.split(",").find((link) => link.includes('rel="last"'));
  const match = lastLink?.match(/.*[?&]page=(\d+).*/);
  return match ? Number(match[1]) : 0;
};
