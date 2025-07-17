import { CommServices } from './comm.services';
import { PermissionsServices } from './permissions.services';
import { OnboardingServices } from './onboardings.services';
import { ContactsServices } from './contacts.services';

export const Servicer = {
	permissions: PermissionsServices,
	comm: CommServices,
	onboardings: OnboardingServices,
	contacts: ContactsServices
};
