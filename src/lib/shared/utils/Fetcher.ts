import type {
	SharedOptions,
	NoBodyOptions,
	WithBodyOptions,
	DataResponse,
	Pagination,
	ParsedQuery
} from '../../@types/Fetcher';

/**
 * Builds a URL with query parameters.
 * @param {string} endpoint - The base endpoint.
 * @param {Record<string, string>} [params] - An object containing query parameters.
 * @returns {string} The constructed URL string.
 */
const buildUrlWithParams = (endpoint: string, params?: Record<string, string>): string => {
	if (params) {
		const url = new URL(endpoint, window.location.origin); // Assumes endpoint can be relative
		Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
		return url.toString();
	}
	return endpoint;
};

/**
 * Handles non-successful HTTP responses.
 * @template T
 * @param {Response} response - The fetch Response object.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized error response.
 */
const handleErrorResponse = async <T>(response: Response): Promise<DataResponse<T>> => {
	const errorMessages: string[] = [`HTTP error! Status: ${response.status} ${response.statusText}`];
	try {
		const errorData = await response.json();
		if (errorData) {
			if (errorData.message && typeof errorData.message === 'string') {
				errorMessages.push(errorData.message);
			} else if (errorData.error && typeof errorData.error === 'string') {
				errorMessages.push(errorData.error);
			} else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
				errorMessages.push(
					...errorData.errors.map((errDetail: { message: string } | string) =>
						typeof errDetail === 'string'
							? errDetail
							: errDetail.message || 'Undescribed error object'
					)
				);
			} else if (typeof errorData === 'string') {
				errorMessages.push(errorData);
			}
		}
	} catch {
		errorMessages.push('Could not parse error response from server.');
	}
	return { data: null, success: false, messages: errorMessages };
};

/**
 * Handles successful HTTP responses.
 * @template T
 * @param {Response} response - The fetch Response object.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized success response.
 */
const handleSuccessfulResponse = async <T>(response: Response): Promise<DataResponse<T>> => {
	if (response.status === 204 || response.headers.get('content-length') === '0') {
		return { data: null, success: true, messages: ['Operation successful with no content.'] };
	}
	const responseData = (await response.json()) as T;
	return { data: responseData, success: true, messages: [] };
};

/**
 * Internal function to make an HTTP request.
 * @template T
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
 * @param {string} endpoint - The API endpoint.
 * @param {SharedOptions & { body?: BodyInit | null }} options - Request options, including optional body.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized response.
 */
const makeRequest = async <T = unknown>(
	method: string,
	endpoint: string,
	options: SharedOptions & { body?: BodyInit | null } // General options type
): Promise<DataResponse<T>> => {
	const url = buildUrlWithParams(endpoint, options.params);

	const fetchOptionsInit: Omit<RequestInit, 'body'> = {
		credentials: options.credentials,
		headers: options.headers,
		integrity: options.integrity,
		keepalive: options.keepalive,
		mode: options.mode,
		redirect: options.redirect,
		referrer: options.referrer,
		referrerPolicy: options.referrerPolicy,
		signal: options.signal,
		window: options.window,
		method: method
	};

	let finalFetchOptions: RequestInit = fetchOptionsInit;

	if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
		if (options.body !== undefined) {
			finalFetchOptions = {
				...fetchOptionsInit,
				body: options.body
			};
		}
	}

	try {
		const response = await fetch(url, finalFetchOptions);

		if (!response.ok) {
			return handleErrorResponse<T>(response);
		}

		return handleSuccessfulResponse<T>(response);
	} catch (error) {
		const messages: string[] = ['A network error occurred or the request could not be completed.'];
		if (error instanceof Error) {
			messages.push(error.message);
		} else if (typeof error === 'string') {
			messages.push(error);
		} else {
			messages.push('An unknown error occurred during the request.');
		}
		return { data: null, success: false, messages };
	}
};

/**
 * Performs a GET request.
 * @template T - The expected type of the response data.
 * @param {string} endpoint - The API endpoint.
 * @param {NoBodyOptions} [options] - Optional request configurations.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized response.
 */
export const get = async <T = unknown>(
	endpoint: string,
	options?: NoBodyOptions
): Promise<DataResponse<T>> => {
	return makeRequest<T>('GET', endpoint, options as SharedOptions & { body?: BodyInit | null });
};

/**
 * Performs a POST request.
 * @template T - The expected type of the response data.
 * @param {string} endpoint - The API endpoint.
 * @param {WithBodyOptions} [options] - Optional request configurations, including a possible body.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized response.
 */
export const post = async <T = unknown>(
	endpoint: string,
	options?: WithBodyOptions
): Promise<DataResponse<T>> => {
	return makeRequest<T>('POST', endpoint, options as SharedOptions & { body?: BodyInit | null });
};

/**
 * Performs a PUT request.
 * @template T - The expected type of the response data.
 * @param {string} endpoint - The API endpoint.
 * @param {WithBodyOptions} [options] - Optional request configurations, including a possible body.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized response.
 */
export const put = async <T = unknown>(
	endpoint: string,
	options?: WithBodyOptions
): Promise<DataResponse<T>> => {
	return makeRequest<T>('PUT', endpoint, options as SharedOptions & { body?: BodyInit | null });
};

/**
 * Performs a PATCH request.
 * @template T - The expected type of the response data.
 * @param {string} endpoint - The API endpoint.
 * @param {WithBodyOptions} [options] - Optional request configurations, including a possible body.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized response.
 */
export const patch = async <T = unknown>(
	endpoint: string,
	options?: WithBodyOptions
): Promise<DataResponse<T>> => {
	return makeRequest<T>('PATCH', endpoint, options as SharedOptions & { body?: BodyInit | null });
};

/**
 * Performs a DELETE request.
 * @template T - The expected type of the response data (usually null for DELETE).
 * @param {string} endpoint - The API endpoint.
 * @param {NoBodyOptions} [options] - Optional request configurations.
 * @returns {Promise<DataResponse<T>>} A promise that resolves to a standardized response.
 */
export const del = async <T = unknown>(
	endpoint: string,
	options?: NoBodyOptions
): Promise<DataResponse<T>> => {
	return makeRequest<T>('DELETE', endpoint, options as SharedOptions & { body?: BodyInit | null });
};

/**
 * Creates a standardized response object.
 * @param {Object} options - Response options
 * @param {boolean} [options.success=false] - Whether the operation was successful
 * @param {string[]} [options.messages=[]] - Success messages
 * @param {string[]} [options.errors=[]] - Error messages
 * @param {unknown} [options.data=null] - Response data
 * @param {Pagination | null} [options.pagination=null] - Pagination information
 * @returns {DataResponse<unknown>} A standardized response object
 */
export const createResponse = ({
	success = false,
	messages = [],
	errors = [],
	data = null,
	pagination = null
}: {
	success?: boolean;
	messages?: string[];
	errors?: string[];
	data?: unknown;
	pagination?: Pagination | null;
}): DataResponse<unknown> => ({
	data,
	success,
	messages,
	errors,
	pagination
});

/**
 * Builds pagination information for API responses.
 * @param {string} baseUrl - The base URL for pagination links
 * @param {string} queryString - The current query string
 * @param {number} page - Current page number
 * @param {number} pageSize - Number of items per page
 * @param {number} total - Total number of items
 * @returns {Pagination} Pagination object with navigation links
 */
export const buildPagination = (
	baseUrl: string,
	queryString: string,
	page: number,
	pageSize: number,
	total: number
): Pagination => {
	const totalPages = Math.ceil(total / pageSize);

	// Parse existing query string and update pagination params
	const buildUrl = (newPage: number) => {
		const params = new URLSearchParams(queryString);
		params.set('page', newPage.toString());
		params.set('pageSize', pageSize.toString());
		return `${baseUrl}?${params.toString()}`;
	};

	const next = page < totalPages ? buildUrl(page + 1) : null;
	const previous = page > 1 ? buildUrl(page - 1) : null;

	return { page, pageSize, total, totalPages, next, previous };
};

/**
 * Parses a URL and extracts query parameters with defaults.
 * @param {string} url - The URL to parse
 * @returns {ParsedQuery} Object containing base URL, query string, and parsed parameters
 */
export const parseQuery = (url: string): ParsedQuery => {
	const urlObj = new URL(url);
	const queryString = urlObj.searchParams.toString();
	return {
		baseUrl: urlObj.origin + urlObj.pathname,
		queryString: queryString,
		params: {
			page: '1',
			pageSize: '10',
			sortBy: 'created_at',
			sortOrder: 'desc',
			search: '',
			// This will override the default params
			...Object.fromEntries(urlObj.searchParams)
		}
	};
};
