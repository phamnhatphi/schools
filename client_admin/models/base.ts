export type Pagination = {
    limit: number;
    page: number;
    total: number;
    sort_column: string;
    sort_direction: string;
};

export type RetrieveApiResponse<T> = {
    data: T;
};

export type ListApiResponse<T> = RetrieveApiResponse<T[]> & {
    pagination: Pagination;
};

export type ValidationErrors = {
    [k: string]: string[];
};
