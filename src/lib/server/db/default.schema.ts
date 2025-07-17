import { timestamp, boolean, text } from 'drizzle-orm/pg-core';

export const defaultSchemaFields = {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	created_at: timestamp('created_at', { mode: 'string' }).$defaultFn(() => new Date()),
	updated_at: timestamp('updated_at', { mode: 'string' }).$onUpdate(() => new Date()),
	created_by: text('created_by').notNull().default('system'),
	updated_by: text('updated_by'),
	is_deleted: boolean('is_deleted').default(false)
};
