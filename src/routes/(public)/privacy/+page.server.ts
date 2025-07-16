import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import Ecco from '$lib/shared/utils/Ecco';
import { privacy_policies_repo } from '$lib/server/db/repos/privacy_policies.repo';

export const load: PageServerLoad = async () => {
    try {
        const latestPrivacy = await privacy_policies_repo.getLatest();

        if (!latestPrivacy) {
            Ecco.debug('terms', { message: `Latest privacy policy not found: ${latestPrivacy}`})
            return fail(404, { message: `Latest privacy policy not found: ${latestPrivacy}`})
        }

        return {
            latestPrivacy: latestPrivacy?.[0] || null
        }
    } catch (error: any) {
        Ecco.error('terms', { message: `Failed to get latest privacy policy: ${error.message}`})
        return fail(500, { message: `Failed to get latest privacy policy: ${error.message}`})
    }
};