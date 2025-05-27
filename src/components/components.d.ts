export type Job = {
  title: string;
  url?: string;
  type: string;
  show?: boolean;
  role: string;
  period: string;
  details: {
    project: string;
    link?: string;
    tasks: string[];
  }[];
  techStack?: {
    languages?: string;
    scm?: string;
    cicd?: string;
  };
  link?: {
    title: string;
    url: string;
  }[];
};

export type Issue = {
  number: number;
  title?: string;
  body: string;
  created_at: string;
  updated_at: string;
  node_id: string;

  user: {
    avatar_url: string;
    login: string;
    site_admin?: boolean;
  };
};

export type Query = {
  keyword?: string;
  in: string;
};

export type MenuProps = {
  menuList: { path?: string; src?: string; title: string }[];
};

export type SpaceProps = {
  method?: "POST" | "GET" | "PATCH" | "DELETE";
  issue?: Issue;
  comments?: Issue[];
  list?: Issue[] | undefined;
  title?: string;
  query?: Query;
  page?: number;
  headless?: boolean;
};

export type PaginationProps = {
  issueNumber?: number;
  page: number;
  next: number;
  prev: number;
  query: Query;
  setPage?: React.Dispatch<React.SetStateAction>;
  setList?: React.Dispatch<React.SetStateAction>;
  setNext?: React.Dispatch<React.SetStateAction>;
  setPrev?: React.Dispatch<React.SetStateAction>;
};

export type Modal = {
  message: string | React.ReactElement | JSX.Element;
  confirmMessage?: string;
  type: string;
  prevRef?: React.RefObject<HTMLInputElement> | null;
  optionComponent?: React.ReactElement | JSX.Element | null;
  handler?: () => void;
};
