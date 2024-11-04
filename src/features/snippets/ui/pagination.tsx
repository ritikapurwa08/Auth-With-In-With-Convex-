// PaginationComponent.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLastPage: boolean;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLastPage,
}) => {
  return (
    <Pagination className="w-full">
      <PaginationContent className="w-full flex justify-between">
        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            size="lg"
            className="w-full flex flex-row justify-center items-center h-10 text-sm"
          >
            <ChevronLeft className="size-4 text-muted-foreground" />
            <span>Prev</span>
          </Button>
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;

          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            Math.abs(pageNumber - currentPage) <= 1
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <Button
                  variant={pageNumber === currentPage ? "default" : "ghost"}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              </PaginationItem>
            );
          }

          if (
            (pageNumber === 2 && currentPage > 3) ||
            (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return null;
        })}

        <PaginationItem>
          <Button
            variant="outline"
            disabled={isLastPage || currentPage === totalPages}
            size="lg"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <span>Next</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
