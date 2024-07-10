export type Issue = {
  number: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  node_id: string;

  user: {
    avatar_url: string;
    login: string;
  };
};

export type SpaceProps = {
  method?: "POST" | "GET" | "PATCH" | "DELETE";
  issue?: Issue;
  list?: Issue[] | undefined;
  title?: string;
};

export type PaginationProps = {
  last: number;
  page: number;
  query: string;
};

export type Modal = {
  message: string;
  type: string;
  prevRef?: React.RefObject<HTMLInputElement> | null;
  optionComponent?: React.ReactElement | null;
  handler?: () => void;
};
