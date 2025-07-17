import { eq } from 'drizzle-orm';
import { db } from '../db';
import { contacts, type Contacts, type ContactsInsert } from '../db/schema/contacts.schema';

export const ContactsServices = {
	/**
	 * Create a new contact
	 * @param user_id - The user_id of the contact to create
	 * @returns The created contact
	 */
	createContact: async (user_id: string, contact: ContactsInsert) => {
		const newContact = await db
			.insert(contacts)
			.values({ user_id, ...contact })
			.returning();
		return newContact?.[0] || null;
	},
	/**
	 * Get a contact by user_id
	 * @param user_id - The user_id of the contact to get
	 * @returns The contact or null if not found
	 */
	getContactByUserId: async (user_id: string) => {
		const contactQuery = await db.select().from(contacts).where(eq(contacts.user_id, user_id));
		return contactQuery?.[0] || null;
	},
	/**
	 * Update a contact
	 * @param contact_id - The id of the contact to update
	 * @param contact - The contact to update
	 * @returns The updated contact
	 */
	updateContact: async (contact_id: string, contact: Partial<Contacts>) => {
		const contactQuery = await db
			.update(contacts)
			.set(contact)
			.where(eq(contacts.id, contact_id))
			.returning();
		return contactQuery?.[0] || null;
	}
};
