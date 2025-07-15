import { seed_comm_template_entries } from './comm_template_entries.seed';
import { seed_comm_templates } from './comm_templates.seed';
import { seed_organizations } from './organizations.seed';
import { seed_privacy_policies } from './privacy_policies.seed';
import { seed_terms_of_services } from './terms_of_services.seed';

// IMPORTANT: Don't use Ecco in the seed files.
// The script will fail if Ecco is used because
// vite can't resolve the Ecco module with the alias.

export const seed = async () => {
	console.log('Seeding database...');

	// Create the default privacy policies and terms of services
	await seed_privacy_policies();
	await seed_terms_of_services();

	// Create the default templates
	await seed_comm_templates();
	await seed_comm_template_entries();

	// Create the default organization
	await seed_organizations();

	console.log('Database seeded successfully!');
};
