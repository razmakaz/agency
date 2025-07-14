import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const ExternalKeysModelName = 'external_keys';

export const external_keys = pgTable(ExternalKeysModelName, {
	...defaultSchemaFields,
	schema_name: text('schema_name').notNull(),
	object_id: text('object_id').notNull(),
	key_name: text('key_name').notNull(),
	key_value: text('key_value').notNull()
});

export type ExternalKeys = typeof external_keys.$inferSelect;
export type ExternalKeysInsert = typeof external_keys.$inferInsert;
