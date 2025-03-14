'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  siblingsCount?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  siblingsCount = 1,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Generate pagination numbers
  const generatePagination = () => {
    // Always show first page, last page, and pages around current page
    const pages = []

    // Add first page
    pages.push(1)

    // Add sibling pages around current page
    for (
      let i = Math.max(2, currentPage - siblingsCount);
      i <= Math.min(totalPages - 1, currentPage + siblingsCount);
      i++
    ) {
      // Add ellipsis if there's a gap
      if (i > 1 && !pages.includes(i - 1) && i - 1 !== 1) {
        pages.push(-1) // Ellipsis marker
      }
      pages.push(i)
    }

    // Add last page if not already added
    if (totalPages > 1 && !pages.includes(totalPages)) {
      // Add ellipsis if there's a gap
      if (!pages.includes(totalPages - 1) && totalPages - 1 !== pages[pages.length - 1]) {
        pages.push(-1) // Ellipsis marker
      }
      pages.push(totalPages)
    }

    return pages
  }

  const pagination = totalPages > 1 ? generatePagination() : []

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-muted-foreground">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
        <strong>{totalItems}</strong> items
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number.parseInt(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 ml-1"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pagination.length > 0 && (
            <div className="flex items-center mx-1">
              {pagination.map((page, i) => {
                if (page === -1) {
                  return (
                    <span key={`ellipsis-${i}`} className="px-2 py-1 text-xs text-muted-foreground">
                      ...
                    </span>
                  )
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 w-8 p-0 mx-0.5"
                    onClick={() => onPageChange(page)}
                  >
                    <span>{page}</span>
                  </Button>
                )
              })}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 mr-1"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
