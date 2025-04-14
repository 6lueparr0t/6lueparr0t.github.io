import React from "react";

import { Link } from "react-router";

import { formatDate } from "@/lib/date";

import { Issue, SpaceProps } from "@/components/components.d";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const IssueTable: React.FC<SpaceProps> = ({ list, page, headless = false }) => {
  return (
    <Table>
      {!headless && (
        <TableHeader className="whitespace-nowrap">
          <TableRow>
            <TableHead className="w-1/12 min-w-16 sm:min-w-4">번호</TableHead>
            <TableHead className="w-8/12 text-center">제목</TableHead>
            <TableHead className="w-1/12 text-center">작성자</TableHead>
            <TableHead className="w-2/12 min-w-24 text-center">작성일</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {list &&
          list.map((row: Issue) => {
            return (
              <TableRow key={`space-${row.number}`} className="rounded-lg">
                <TableCell className="font-medium min-w-16 sm:min-w-4">{row.number}</TableCell>
                <TableCell className="block truncate mt-2 w-60 sm:w-80 md:w-[500px] lg:w-8/12">
                  <Link to={`/space/${row.number}?page=${page}`}>{row.title}</Link>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Avatar>
                      <AvatarImage src={row.user.avatar_url} alt={`@${row.user.login}`} />
                      <AvatarFallback>{row.user.login}</AvatarFallback>
                    </Avatar>
                    {row.user.login}
                  </div>
                </TableCell>
                <TableCell className="text-right lg:text-center">
                  {row.created_at
                    ? formatDate(new Date(row.created_at), "yyyy-MM-dd HH:mm:ss")
                    : ""}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
};
