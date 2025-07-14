import { pgTable } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export const PayrollModelName = 'payroll';

export const payroll = pgTable(PayrollModelName, {
	...defaultSchemaFields
});
