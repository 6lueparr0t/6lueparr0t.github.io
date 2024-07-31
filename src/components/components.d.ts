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
  in: string
};

export type MenuProps = {
  menuList: { path: string; title: string }[];
};

export type SpaceProps = {
  method?: "POST" | "GET" | "PATCH" | "DELETE";
  issue?: Issue;
  comments?: Issue[];
  list?: Issue[] | undefined;
  title?: string;
  query?: Query;
};

export type PaginationProps = {
  last: number;
  page: number;
  query: Query;
};

export type Modal = {
  message: string | React.ReactElement | JSX.Element;
  confirmMessage?: string;
  type: string;
  prevRef?: React.RefObject<HTMLInputElement> | null;
  optionComponent?: React.ReactElement | JSX.Element | null;
  handler?: () => void;
};
