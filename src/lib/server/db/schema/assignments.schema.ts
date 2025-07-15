import { date, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { organizations } from './organizations.schema';
import { contacts } from './contacts.schema';
import { addresses } from './addresses.schema';

export enum AssignmentType {
	W2 = 'W2',
	C2C = 'C2C',
	IC = 'IC'
}

export const AssignmentsModelName = 'assignments';

export const assignments = pgTable(AssignmentsModelName, {
	...defaultSchemaFields,

	// Core Details
	worker_contact_id: text('worker_contact_id')
		.references(() => contacts.id)
		.notNull(),

	billing_contact_id: text('billing_contact_id').references(() => contacts.id),

	worksite_id: text('worksite_id')
		.references(() => addresses.id)
		.notNull(),
	organization_id: text('organization_id').references(() => organizations.id),

	// Job details
	assignment_type: text('assignment_type').$type<AssignmentType>().notNull(),
	job_title: text('job_title').notNull(),
	job_description: text('job_description').notNull(),
	job_start_date: date('job_start_date').notNull(),
	job_end_date: date('job_end_date')
});

export type Assignments = typeof assignments.$inferSelect;
export type AssignmentsInsert = typeof assignments.$inferInsert;
