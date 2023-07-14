const DEFAULT_LIMIT = "10";
const DEFAULT_OFFSET = "0";

interface PaginationResult {
  totalCount: number;
  totalPages: number;
  prevPageUrl: string | null;
  nextPageUrl: string | null;
}

export const generatePagination = (
  totalCount: number,
  offset: number,
  limit: number,
  baseUrl: string
): PaginationResult => {
  const totalPages = Math.ceil(totalCount / limit);
  const prevPageOffset = offset - limit;
  const nextPageOffset = offset + limit;
  const prevPageUrl =
    prevPageOffset >= 0
      ? `${baseUrl}?offset=${prevPageOffset}&limit=${limit}`
      : null;
  const nextPageUrl =
    nextPageOffset < totalCount
      ? `${baseUrl}?offset=${nextPageOffset}&limit=${limit}`
      : null;

  return {
    totalCount,
    totalPages,
    prevPageUrl,
    nextPageUrl,
  };
};

export { DEFAULT_LIMIT, DEFAULT_OFFSET };
