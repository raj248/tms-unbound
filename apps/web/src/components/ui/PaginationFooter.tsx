import { Button } from "@workspace/ui/components/button"

export function PaginationFooter({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  itemLabel = "items"
}: {
  currentPage: number
  setCurrentPage: (page: number | ((p: number) => number)) => void
  totalItems: number
  itemsPerPage: number
  itemLabel?: string
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  if (totalItems === 0) return null

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <span className="text-center text-xs font-medium text-muted-foreground sm:text-left">
        Showing {Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage)} of {totalItems} {itemLabel}
      </span>
      <div className="flex flex-wrap justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          &larr; Prev
        </Button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "secondary" : "outline"}
            size="sm"
            className={`h-8 w-8 p-0 text-xs ${currentPage === i + 1 ? "border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  )
}
