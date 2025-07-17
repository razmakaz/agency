import { CommServices } from './comm.services';
import { PermissionsServices } from './permissions.services';
import { OnboardingServices } from './onboardings.services';
import { ContactsServices } from './contacts.services';
import { AuthServices } from './auth.services';

export const Services = {
	auth: AuthServices,
	permissions: PermissionsServices,
	comm: CommServices,
	onboardings: OnboardingServices,
	contacts: ContactsServices
};
