import { pgTable, text } from 'drizzle-orm/pg-core';

import { defaultSchemaFields } from '../default.schema';
import { comm_items } from './comm_items.schema';

export enum CommItemStatusType {
	// Presend
	NEW = 'NEW',
	SCHEDULED = 'SCHEDULED',
	QUEUED = 'QUEUED',
	CANCELED = 'CANCELED',

	// Send
	SENT = 'SENT',
	DELIVERED = 'DELIVERED',
	DELAYED = 'DELAYED',
	FAILED = 'FAILED',

	// Postsend
	OPENED = 'OPENED',
	CLICKED = 'CLICKED',
	BOUNCED = 'BOUNCED',
	COMPLAINED = 'COMPLAINED',

	// Other
	ERROR = 'ERROR',
	UNKNOWN = 'UNKNOWN',
	RETRY = 'RETRY'
}

export const CommItemStatusModelName = 'comm_item_statuses';

export const comm_item_statuses = pgTable(CommItemStatusModelName, {
	...defaultSchemaFields,
	comm_item_id: text('comm_item_id').references(() => comm_items.id),
	status: text('status').$type<CommItemStatusType>().notNull(),
	note: text('note')
});
