import { pgTable } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const PayrollsModelName = 'payrolls';

export const payrolls = pgTable(PayrollsModelName, {
	...defaultSchemaFields
});
