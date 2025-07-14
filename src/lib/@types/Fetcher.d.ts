// Common parts for options, excluding method and body as they are handled differently
export type SharedOptions = Omit<RequestInit, 'method' | 'body'> & {
	params?: Record<string, string>;
};

// Options for GET, DELETE (no body)
export type NoBodyOptions = SharedOptions;

// Options for POST, PUT, PATCH (can have body)
export type WithBodyOptions = SharedOptions & {
	body?: BodyInit | null;
};

// Standardized response structure
export type DataResponse<T> = {
	data?: T | null;
	success: boolean;
	errors?: string[];
	messages?: string[];
	pagination?: Pagination | null;
};

export type Pagination = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	next: string | null;
	previous: string | null;
};

export type QueryParams = {
	page: string;
	pageSize: string;
	sortBy: string;
	sortOrder: string;
	search: string;
	[key: string]: string;
};

export type ParsedQuery = {
	baseUrl: string;
	queryString: string;
	params: QueryParams;
};
