import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { contacts } from './contacts.schema';

export const ApprovalsOptions = {
	SHIFT: {
		name: 'Shift'
	},
	ASSIGNMENT: {
		name: 'Assignment'
	},
	EXPENSE: {
		name: 'Expense'
	}
};

export type ApprovalsEntityType = keyof typeof ApprovalsOptions;

export const ApprovalsModelName = 'approvals';

export const approvals = pgTable(ApprovalsModelName, {
	...defaultSchemaFields,
	entity_type: text('entity_type')
		.$type<ApprovalsEntityType>()
		.notNull()
		.default(ApprovalsOptions.SHIFT.name as ApprovalsEntityType),
	entity_id: text('entity_id'),
	approved_by: text('approved_by').references(() => contacts.id),
	approved_at: timestamp('approved_at')
});

export type Approvals = typeof approvals.$inferSelect;
export type ApprovalsInsert = typeof approvals.$inferInsert;
