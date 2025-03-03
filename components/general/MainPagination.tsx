"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
}

export function MainPagination({ currentPage, totalPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(`?${params.toString()}`);
  }

  function generatePaginationItems() {
    const items = [];
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          items.push(i);
        }
        items.push(null);
        items.push(totalPage);
      } else if (currentPage >= totalPage - 2) {
        items.push(1);
        items.push(null);
        for (let i = totalPage - 2; i <= totalPage; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push(null);
        items.push(currentPage - 1);
        items.push(currentPage);
        items.push(currentPage + 1);
        items.push(null);
        items.push(totalPage);
      }
    }
    return items;
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePageChange(currentPage - 1);
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
        {generatePaginationItems().map((page, index) =>
          page === null ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPage) handlePageChange(currentPage + 1);
            }}
            className={
              currentPage === totalPage ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
