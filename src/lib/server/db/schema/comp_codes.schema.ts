import { sql } from 'drizzle-orm';
import { defaultSchemaFields } from '../default.schema';
import { char, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const CompCodeModelName = 'comp_code';

export const comp_codes = pgTable(
	CompCodeModelName,
	{
		...defaultSchemaFields,
		country: char('country', { length: 2 }).notNull().default('US'),
		region: char('region', { length: 3 }).notNull(),
		code: text('code').notNull(),
		description: text('description'),
		effective_from: timestamp('effective_from')
			.notNull()
			.default(sql`now()`)
	},
	(table) => [
		index('idx_comp_codes_country_region_code').on(table.country, table.region, table.code)
	]
);

export type CompCodes = typeof comp_codes.$inferSelect;
export type CompCodesInsert = typeof comp_codes.$inferInsert;
