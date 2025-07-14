import { PUBLIC_LOKI_URL, PUBLIC_LOG_LEVEL, PUBLIC_APP_NAME } from '$env/static/public';
import { post } from '$lib/shared/utils/Fetcher';
import type { DataResponse, WithBodyOptions } from '$lib/@types/Fetcher';

export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	FATAL = 4,
	NONE = 5 // Special level to disable all logging
}

interface EccoStream {
	stream: Record<string, string>;
	values: [string, string][];
}

interface EccoPayload {
	streams: EccoStream[];
}

// State management using closure
const LOKI_URL = PUBLIC_LOKI_URL || '';
const APP_NAME = PUBLIC_APP_NAME || 'unspecified-app';
let noloki = false;

export function getLogLevelFromString(levelStr: string | undefined): LogLevel {
	if (!levelStr) return LogLevel.INFO; // Default level
	switch (levelStr.toUpperCase()) {
		case 'DEBUG':
			return LogLevel.DEBUG;
		case 'INFO':
			return LogLevel.INFO;
		case 'WARN':
			return LogLevel.WARN;
		case 'ERROR':
			return LogLevel.ERROR;
		case 'FATAL':
			return LogLevel.FATAL;
		case 'NONE':
			return LogLevel.NONE;
		default:
			console.warn(`Invalid PUBLIC_LOG_LEVEL: "${levelStr}". Defaulting to INFO.`);
			return LogLevel.INFO;
	}
}

async function sendToLoki({
	level,
	sector,
	message
}: {
	level: LogLevel;
	sector: string;
	message: string;
}) {
	if (noloki || APP_LOG_LEVEL <= LogLevel.DEBUG) return;

	if (!LOKI_URL) {
		if (!noloki) {
			console.warn('Loki URL not configured. Skipping log push.');
			noloki = true;
		}
		return;
	}

	const timestamp = (Date.now() * 1_000_000).toString(); // Nanoseconds

	const payload: EccoPayload = {
		streams: [
			{
				stream: {
					level: LogLevel[level].toLowerCase(),
					sector,
					app: APP_NAME
				},
				values: [[timestamp, message]]
			}
		]
	};

	const options: WithBodyOptions = {
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	};

	try {
		const result: DataResponse<unknown> = await post(`${LOKI_URL}/loki/api/v1/push`, options);
		if (!result.success) {
			console.warn('Loki failed. Disabling Loki logging.');
			noloki = true;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		// console.warn('Error sending log to Loki:', error, payload);
	}
}

function log(
	level: LogLevel,
	originalLogFn: (...data: unknown[]) => void,
	sector: string,
	...args: unknown[]
) {
	if (level >= APP_LOG_LEVEL && APP_LOG_LEVEL !== LogLevel.NONE) {
		originalLogFn(`[${LogLevel[level]}]`, `<${sector}>`, ...args);

		const message = args
			.map((arg) => {
				if (typeof arg === 'string') return arg;
				if (arg instanceof Error) return arg.stack || arg.message;
				try {
					return JSON.stringify(arg);
				} catch {
					return String(arg);
				}
			})
			.join(' ');

		sendToLoki({
			level,
			sector: sector,
			message: message
		});
	}
}

export function table(sector: string, data: unknown[]): void {
	if (APP_LOG_LEVEL >= LogLevel.INFO && APP_LOG_LEVEL !== LogLevel.NONE) {
		console.table(data);
		sendToLoki({
			level: LogLevel.INFO,
			sector: sector,
			message: JSON.stringify(data)
		});
	}
}

export function debug(sector: string, ...args: unknown[]): void {
	log(LogLevel.DEBUG, console.log.bind(console), sector, ...args);
}

export function info(sector: string, ...args: unknown[]): void {
	log(LogLevel.INFO, console.info.bind(console), sector, ...args);
}

export function warn(sector: string, ...args: unknown[]): void {
	log(LogLevel.WARN, console.warn.bind(console), sector, ...args);
}

export function error(sector: string, ...args: unknown[]): void {
	log(LogLevel.ERROR, console.error.bind(console), sector, ...args);
}

export function fatal(sector: string, ...args: unknown[]): void {
	// console.error is often used for FATAL as there isn't a console.fatal
	log(LogLevel.FATAL, console.error.bind(console), sector, ...args);
}

export default {
	debug,
	info,
	warn,
	error,
	fatal,
	table
};

export const APP_LOG_LEVEL: LogLevel = getLogLevelFromString(PUBLIC_LOG_LEVEL);
