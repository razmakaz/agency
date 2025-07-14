import { pgTable, timestamp, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { assignments } from './assignments.schema';

export const ShiftsModelName = 'shifts';

export const shifts = pgTable(ShiftsModelName, {
	...defaultSchemaFields,
	assignment_id: text('assignment_id').references(() => assignments.id),
	start_time: timestamp('start_time'),
	break_start: timestamp('break_start'),
	break_end: timestamp('break_end'),
	end_time: timestamp('end_time'),
	revised_from: text('revised_from').references(() => shifts.id),
	revised_to: text('revised_to').references(() => shifts.id)
});

export type Shifts = typeof shifts.$inferSelect;
export type ShiftsInsert = typeof shifts.$inferInsert;
