import { auth } from '$lib/server/auth';
import { ContactType, type ContactsInsert } from '$lib/server/db/schema/contacts.schema.js';
import { Servicer } from '$lib/server/services/Servicer.js';

export const GET = async ({ request }) => {
	// Get the user's session, get the contact by user_id.
	const session = await auth.api.getSession({
		headers: request.headers
	});

	let contact = await Servicer.contacts.getContactByUserId(session?.user?.id ?? '');

	if (!contact) {
		// Create a new contact
		const payload = {
			user_id: session?.user?.id ?? '',
			contact_type: ContactType.Partner
		} as ContactsInsert;
		contact = await Servicer.contacts.createContact(session?.user?.id ?? '', payload);
	}

	return new Response(JSON.stringify(contact), { status: 200 });
};

export const PATCH = async ({ request }) => {
	// Get the user's session, update the contact with the body.
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const body = await request.json();

	const contact = await Servicer.contacts.getContactByUserId(session?.user?.id ?? '');
	if (!contact) {
		return new Response('Contact not found', { status: 404 });
	}

	console.log('body', body);

	const updatedContact = await Servicer.contacts.updateContact(contact.id, body);

	return new Response(JSON.stringify(updatedContact), { status: 200 });
};
