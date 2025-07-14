import type { UploadedDocumentInsert } from '$lib/server/db/schema/document';

export type S3ProviderOptions = {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	bucket: string;
	endpoint?: string;
	useSSL?: boolean;
	port?: number;
	forcePathStyle?: boolean;
	signatureVersion?: string;
	forcePathStyle?: boolean;
};

export type S3Provider = {
	upload: (file: File) => Promise<TS3UploadResult>;
	download: (key: string) => Promise<File>;
	delete: (key: string) => Promise<void>;
	list: (prefix?: string) => Promise<string[]>;
	getPresignedUrl: (key: string) => Promise<string>;
};

export type TS3UploadResult = Pick<
	UploadedDocumentInsert,
	'filename' | 'content_type' | 'content_length' | 'content_hash' | 's3_bucket' | 's3_key'
> & {
	upload_url: string;
};
