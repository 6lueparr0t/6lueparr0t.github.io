import { Octokit } from "octokit";

import { PER_PAGE } from "@/lib/constants";

import { Issue } from "@/components/components";

const repo = import.meta.env.VITE_APP_GIT_REPO;
const owner = import.meta.env.VITE_APP_GIT_OWNER;
const auth = import.meta.env.VITE_APP_GIT_TOKEN || import.meta.env.VITE_APP_GIT_TOKEN_CLASSIC;

const octokit = new Octokit({
  auth: auth,
});

// GitHub GraphQL API v4
// https://docs.github.com/en/graphql

type GqlIssueNode = {
  number?: number;
  title?: string;
  body?: string;
  createdAt?: string;
  updatedAt?: string;
  id: string;
  author?: { login: string; avatarUrl: string } | null;
  comments?: { nodes: GqlIssueNode[] };
};

type ListResponse = {
  repository: {
    issues: { totalCount: number; nodes: GqlIssueNode[]; pageInfo: { hasNextPage: boolean } };
  };
};

type SearchResponse = {
  search: { issueCount: number; nodes: GqlIssueNode[]; pageInfo: { hasNextPage: boolean } };
};

type IssueResponse = {
  repository: { issue: GqlIssueNode | null };
};

const LIST_QUERY = `
  query ($owner: String!, $repo: String!, $first: Int!) {
    repository(owner: $owner, name: $repo) {
      issues(first: $first, states: OPEN, orderBy: { field: CREATED_AT, direction: DESC }) {
        totalCount
        nodes { number title body createdAt updatedAt id author { login avatarUrl } }
        pageInfo { hasNextPage }
      }
    }
  }
`;

const SEARCH_QUERY = `
  query ($q: String!, $first: Int!) {
    search(query: $q, type: ISSUE, first: $first) {
      issueCount
      nodes { ... on Issue { number title body createdAt updatedAt id author { login avatarUrl } } }
      pageInfo { hasNextPage }
    }
  }
`;

const ISSUE_QUERY = `
  query ($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $number) {
        number title body createdAt updatedAt id author { login avatarUrl }
        comments(first: 100) {
          nodes { body createdAt updatedAt id author { login avatarUrl } }
        }
      }
    }
  }
`;

// GraphQL 노드(camelCase) 를 컴포넌트가 쓰는 Issue(snake_case) 형태로 변환
const parseNode = (node: GqlIssueNode): Issue => ({
  number: node.number ?? 0,
  title: node.title,
  body: node.body ?? "",
  created_at: node.createdAt ?? "",
  updated_at: node.updatedAt ?? "",
  node_id: node.id,
  user: {
    avatar_url: node.author?.avatarUrl ?? "",
    login: node.author?.login ?? "",
  },
});

// Github GraphQL API 를 사용하여 목록을 가져옴
export const getList = async (
  query: { keyword?: string; in: string } = { keyword: "", in: "title" },
  option: { page?: number; per_page?: number } = {}
): Promise<{
  list: Issue[];
  next: number;
  prev: number;
  total: number;
  status?: number;
  message?: object;
}> => {
  const page = option.page ?? 1;
  const perPage = option.per_page ?? PER_PAGE;

  try {
    // GraphQL 은 커서 기반이라 페이지 점프가 불가능하므로,
    // first 개를 가져온 뒤 해당 페이지 구간만 잘라 페이지 번호 UI 를 유지한다. (상한 100)
    const first = Math.min(page * perPage, 100);

    let nodes: GqlIssueNode[];
    let hasNextPage: boolean;
    let totalCount: number;

    if (query.keyword) {
      const response = await octokit.graphql<SearchResponse>(SEARCH_QUERY, {
        // is:issue 필수 — GraphQL search(type: ISSUE) 는 이게 없으면 결과가 0건이 됨
        q: `${query.keyword} in:${query.in} repo:${owner}/${repo} is:issue`,
        first,
      });
      nodes = response.search.nodes;
      hasNextPage = response.search.pageInfo.hasNextPage;
      totalCount = response.search.issueCount;
    } else {
      const response = await octokit.graphql<ListResponse>(LIST_QUERY, {
        owner,
        repo,
        first,
      });
      nodes = response.repository.issues.nodes;
      hasNextPage = response.repository.issues.pageInfo.hasNextPage;
      totalCount = response.repository.issues.totalCount;
    }

    const list = nodes.slice((page - 1) * perPage, page * perPage).map(parseNode);
    const next = hasNextPage ? page + 1 : 0;
    const prev = page > 1 ? page - 1 : 0;
    const total = Math.max(Math.ceil(totalCount / perPage), 1); // 전체 페이지 수

    return { list, next, prev, total };
  } catch (error) {
    return {
      list: [],
      next: 0,
      prev: 0,
      total: 1,
      status: 500,
      message: error ?? "",
    };
  }
};

// Github GraphQL API 를 사용하여 단일 이슈와 댓글을 가져옴
export const getIssue = async (
  // 호출부 호환을 위해 시그니처 유지 (GraphQL 단일 조회에선 미사용)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _option: { page?: number; per_page?: number } = {},
  issueNumber: number
): Promise<{
  issue: Issue;
  comments?: Issue[];
  status?: number;
  message?: object;
}> => {
  const emptyIssue: Issue = {
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

  try {
    const response = await octokit.graphql<IssueResponse>(ISSUE_QUERY, {
      owner,
      repo,
      number: issueNumber,
    });

    const node = response.repository.issue;
    if (!node) throw new Error("Could not fetch details for selected event.");

    const issue = parseNode(node);
    const comments = (node.comments?.nodes ?? []).map(parseNode);

    return { issue, comments };
  } catch (error) {
    return {
      issue: emptyIssue,
      comments: [],
      status: 500,
      message: error ?? "",
    };
  }
};
