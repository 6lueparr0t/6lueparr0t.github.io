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

import { PAGE_LENGTH } from "@/lib/constants";

export const IssuePagination: React.FC<PaginationProps> = ({ last, page, query }) => {
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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationFirst to={`/space?page=1${query}`} />
        </PaginationItem>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationPrevious to={`/space?page=${prev}${query}`} />
        </PaginationItem>
        {Array.from({ length: PAGE_LENGTH }).map((_, index) => {
          const num = index + start + 1;
          if (num > last) return;
          return (
            <PaginationItem key={index}>
              <PaginationLink
                to={`/space?page=${num}${query}`}
                {...(num === page ? { isActive: true } : {})}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationNext to={`/space?page=${next}${query}`} />
        </PaginationItem>
        <PaginationItem className="rounded-md border-solid border-2 border-gray-400">
          <PaginationLast to={`/space?page=${last}${query}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
