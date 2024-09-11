import { PaginationProps } from "@/components/components.d";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";

import { makeQuery } from "@/lib/space";
import { PER_PAGE, PAGE_LENGTH } from "@/lib/constants";
import { getList } from "@/lib/space";
import { useCallback } from "react";

export const IssuePagination: React.FC<PaginationProps> = ({
  issueNumber = null,
  last,
  page,
  query,
}) => {
  const start = (Math.ceil(page / PAGE_LENGTH) - 1) * PAGE_LENGTH;

  /**
   * ? INFO : pagination method 1 : 페이지네이션의 맨 끝으로
   * */
  // const prev = Math.max(1, (Math.floor(page / PAGE_LENGTH) - 1) * PAGE_LENGTH + 1);
  /**
   * ? INFO : pagination method 2 : 페이지네이션의 맨 마지막으로
   * */
  const prev = Math.max(1, start);

  const next = Math.min(last, Math.ceil(page / PAGE_LENGTH) * PAGE_LENGTH + 1);
  const queryString = makeQuery(query);

  const issueLink = issueNumber ? "/" + issueNumber : '';

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationFirst to={`/space${issueLink}?page=1${queryString}`} />
        </PaginationItem>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationPrevious to={`/space${issueLink}?page=${prev}${queryString}`} />
        </PaginationItem>
        {Array.from({ length: PAGE_LENGTH }).map((_, index) => {
          const num = index + start + 1;
          if (num > last) return;
          return (
            <PaginationItem key={index}>
              <PaginationLink
                to={`/space${issueLink}?page=${num}${queryString}`}
                {...(num === page ? { isActive: true } : {})}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationNext to={`/space${issueLink}?page=${next}${queryString}`} />
        </PaginationItem>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationLast to={`/space${issueLink}?page=${last}${queryString}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export const IssuePaginationWithState: React.FC<PaginationProps> = ({
  last,
  page,
  query,
  setList,
  setPage,
  setLast,
}) => {
  const start = (Math.ceil(page / PAGE_LENGTH) - 1) * PAGE_LENGTH;

  /**
   * ? INFO : pagination method 1 : 페이지네이션의 맨 끝으로
   * */
  // const prev = Math.max(1, (Math.floor(page / PAGE_LENGTH) - 1) * PAGE_LENGTH + 1);
  /**
   * ? INFO : pagination method 2 : 페이지네이션의 맨 마지막으로
   * */
  const prev = Math.max(1, start);

  const next = Math.min(last, Math.ceil(page / PAGE_LENGTH) * PAGE_LENGTH + 1);

  // 페이지 클릭 시 데이터를 fetch하는 함수
  const handlePageClick = useCallback(async (pageNum: number) => {
    try {
      const data = await getList(query, { page: pageNum, per_page: PER_PAGE / 2 });
      if (setPage) setPage(pageNum);
      if (setList) setList(data.list); // 받은 데이터를 state에 저장
      if (setLast) setLast(data?.last ? data?.last : pageNum);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  }, [query, setPage, setList, setLast]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationFirst to={"#"} onClick={() => handlePageClick(1)} />
        </PaginationItem>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationPrevious to={"#"} onClick={() => handlePageClick(prev)} />
        </PaginationItem>
        {Array.from({ length: PAGE_LENGTH }).map((_, index) => {
          const num = index + start + 1;
          if (num > last) return;
          return (
            <PaginationItem key={index}>
              <PaginationLink
                to={"#"}
                onClick={() => handlePageClick(num)}
                {...(num === page ? { isActive: true } : {})}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationNext to={"#"} onClick={() => handlePageClick(next)} />
        </PaginationItem>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationLast to={"#"} onClick={() => handlePageClick(last)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
