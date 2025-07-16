import { terms_of_services_repo } from '$lib/server/db/repos/terms_of_services.repo';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import Ecco from '$lib/shared/utils/Ecco';

export const load: PageServerLoad = async () => {
	try {
		const latestTos = await terms_of_services_repo.getLatest();

		if (!latestTos) {
            Ecco.debug('terms', { message: `Latest terms of service not found: ${latestTos}`})
            return fail(404, { message: `Latest terms of service not found: ${latestTos}`})
		}

        return {
            latestTos: latestTos?.[0] || null
        }
	} catch (error: any) {
        Ecco.error('terms', { message: `Failed to get latest terms: ${error.message}`})
        return fail(500, { message: `Failed to get latest terms: ${error.message}`})
	}
};
