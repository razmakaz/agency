import { seed_comm_template_entries } from './comm_template_entries.seed';
import { seed_comm_templates } from './comm_templates.seed';
import { seed_organizations } from './organizations.seed';
import { seed_privacy_policies } from './privacy_policies.seed';
import { seed_terms_of_services } from './terms_of_services.seed';

export const seed = async () => {
	await seed_comm_template_entries();
	await seed_comm_templates();
	await seed_organizations();
	await seed_privacy_policies();
	await seed_terms_of_services();
};
