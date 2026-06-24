import { useCallback } from "react";

import { PAGE_LENGTH, PER_PAGE } from "@/lib/constants";
import { getList } from "@/lib/space";

import { PaginationProps } from "@/components/components.d";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const IssuePagination: React.FC<PaginationProps> = ({
  page,
  next,
  prev,
  total = 1,
  query,
  setList,
  setPage,
  setNext,
  setPrev,
  setTotal,
}) => {
  // 페이지 클릭 시 데이터를 fetch하는 함수
  const handlePageClick = useCallback(
    async (pageNum: number) => {
      if (pageNum < 1) return;
      try {
        const data = await getList(query, { page: pageNum, per_page: PER_PAGE });
        if (setPage) setPage(pageNum);
        if (setList) setList(data.list); // 받은 데이터를 state에 저장
        if (setNext) setNext(data.next); // 받은 데이터를 state에 저장
        if (setPrev) setPrev(data.prev); // 받은 데이터를 state에 저장
        if (setTotal) setTotal(data.total); // 전체 페이지 수
      } catch (error) {
        console.error("Error fetching list:", error);
      }
    },
    [query, setPage, setList, setNext, setPrev, setTotal]
  );

  // PAGE_LENGTH 개씩 묶어, 현재 페이지가 속한 블록의 페이지 번호들을 보여줌
  const blockStart = Math.floor((page - 1) / PAGE_LENGTH) * PAGE_LENGTH + 1;
  const blockEnd = Math.min(blockStart + PAGE_LENGTH - 1, total);
  const pages = Array.from({ length: blockEnd - blockStart + 1 }, (_, i) => blockStart + i);

  // 스타일 클래스 조건부 설정
  const prevBorderClass = prev <= 0 ? "border-gray-900" : "border-gray-400";
  const nextBorderClass = next <= 0 ? "border-gray-900" : "border-gray-400";

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className={`rounded-md border-solid border-2 ${prevBorderClass}`}>
          <PaginationPrevious
            type="button"
            onClick={() => handlePageClick(prev)}
            {...(prev <= 0 && { isActive: false, disabled: true })}
          />
        </PaginationItem>
        {pages.map((p) => (
          <PaginationItem key={`page-${p}`}>
            <PaginationLink type="button" onClick={() => handlePageClick(p)} isActive={p === page}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem className={`rounded-md border-solid border-2 ${nextBorderClass}`}>
          <PaginationNext
            type="button"
            onClick={() => handlePageClick(next)}
            {...(next <= 0 && { isActive: false, disabled: true })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
