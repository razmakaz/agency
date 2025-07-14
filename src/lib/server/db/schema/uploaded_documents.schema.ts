import { index, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { AssignmentsModelName } from './assignments.schema';
import { ContactsModelName } from './contacts.schema';
import { OrganizationsModelName } from './organizations.schema';
import { ShiftsModelName } from './shifts.schema';
import { ExpensesModelName } from './expense.schema';
import { VouchersModelName } from './vouchers.schema';

export const AllowedDocumentEntities = {
	ASSIGNMENT: {
		name: 'Assignment',
		schemaName: AssignmentsModelName
	},
	CONTACT: {
		name: 'Contact',
		schemaName: ContactsModelName
	},
	ORGANIZATION: {
		name: 'Organization',
		schemaName: OrganizationsModelName
	},
	EXPENSE: {
		name: 'Expense',
		schemaName: ExpensesModelName
	},
	SHIFT: {
		name: 'Shift',
		schemaName: ShiftsModelName
	},
	VOUCHER: {
		name: 'Voucher',
		schemaName: VouchersModelName
	}
};

export type AllowedDocumentEntityType =
	(typeof AllowedDocumentEntities)[keyof typeof AllowedDocumentEntities]['schemaName'];

export const UploadedDocumentsModelName = 'uploaded_documents';

export const uploaded_documents = pgTable(
	UploadedDocumentsModelName,
	{
		...defaultSchemaFields,

		entity_type: text('entity_type')
			.$type<AllowedDocumentEntityType>()
			.notNull()
			.default(AllowedDocumentEntities.ASSIGNMENT.schemaName),
		entity_id: text('entity_id').notNull(),

		filename: text('filename').notNull(),
		content_type: text('content_type').notNull(),
		content_length: integer('content_length').notNull(),
		content_hash: text('content_hash').notNull(),

		// S3
		s3_bucket: text('s3_bucket').notNull(),
		s3_key: text('s3_key').notNull().unique()
	},
	(table) => [index('idx_uploaded_documents_entity').on(table.entity_type, table.entity_id)]
);

export type UploadedDocuments = typeof uploaded_documents.$inferSelect;
export type UploadedDocumentsInsert = typeof uploaded_documents.$inferInsert;
