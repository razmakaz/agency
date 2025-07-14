import { pgTable } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const DistributionsModelName = 'distributions';

export const distributions = pgTable(DistributionsModelName, {
	...defaultSchemaFields
});

export type Distributions = typeof distributions.$inferSelect;
export type DistributionsInsert = typeof distributions.$inferInsert;
