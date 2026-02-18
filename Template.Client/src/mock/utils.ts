export const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateMockToken = (userId: string) =>
  `mock-token-${userId}-${Date.now()}`;

export const extractUserIdFromToken = (token: string | null) => {
  if (
    !token ||
    (!token.startsWith("mock-token-") && !token.startsWith("mock-jwt-token-"))
  ) {
    return null;
  }

  if (token.startsWith("mock-jwt-token-")) {
    const parts = token.split("-");
    if (parts.length >= 4) {
      const userId = parts[3];
      return userId;
    }
    return null;
  }

  const userId = token.split("-")[2];
  return userId;
};

export const createSuccessResponse = <T>(
  data: T,
  message: string = "Success"
) => ({
  success: true,
  data,
  message,
});

export const createErrorResponse = (message: string, code?: string) => ({
  success: false,
  message,
  code,
});

export const paginateData = <T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    items: paginatedData,
    totalCount: data.length,
    pageNumber: page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
};

export const filterData = <T>(
  data: T[],
  searchTerm?: string,
  filters?: Record<string, unknown>
): T[] => {
  let filteredData = [...data];

  if (searchTerm) {
    filteredData = filteredData.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        filteredData = filteredData.filter(
          (item) => (item as Record<string, unknown>)[key] === value
        );
      }
    });
  }

  return filteredData;
};
