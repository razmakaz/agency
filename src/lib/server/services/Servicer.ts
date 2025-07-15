import { CommServices } from './comm.services';
import { PermissionsServices } from './permissions.services';

export const Servicer = {
	permissions: PermissionsServices,
	comm: CommServices
};
