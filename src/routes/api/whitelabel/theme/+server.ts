import { auth } from '$lib/server/auth.js';
import { db } from '$lib/server/db/index.js';
import { eq, or } from 'drizzle-orm';
import { white_label_configs } from '$lib/server/db/schema/white_label_configs.schema';
import Color from 'colorjs.io';

export const GET = async ({ request, url }) => {
	// Get subdomain
	const subdomain = request.headers.get('host')?.split('.')[0] ?? '';

	const configQuery = await db
		.select()
		.from(white_label_configs)
		.where(
			or(
				eq(white_label_configs.subdomain, subdomain),
				eq(white_label_configs.custom_domain, url.origin)
			)
		)
		.limit(1);

	const config = configQuery[0] || null;

	if (!config) {
		// Return the default theme;
		return new Response(
			`
                :root {
                    --color-primary: ${new Color('#FCB900').to('oklch').toString()};
                    --color-primary-content: ${new Color('#1c1c1c').to('oklch').toString()};
                    --color-secondary: ${new Color('#FCB900').to('oklch').toString()};
                    --color-secondary-content: ${new Color('#1c1c1c').to('oklch').toString()};
                }
            `.replace(/(\([^)]+\))|[\s]+/g, (m, group1) => (group1 ? group1 : '')),
			{ status: 200, headers: { 'Content-Type': 'text/css' } }
		);
	}

	const css = `
        :root {
            --color-primary: ${new Color(config.primary_color ?? '#000000').to('oklch').toString()};
            --color-primary-content: ${new Color(config.primary_content ?? '#FFFFFF').to('oklch').toString()};
            --color-secondary: ${new Color(config.secondary_color ?? '#000000').to('oklch').toString()};
            --color-secondary-content: ${new Color(config.secondary_content ?? '#FFFFFF').to('oklch').toString()};
        }
    `.replace(/(\([^)]+\))|[\s]+/g, (m, group1) => (group1 ? group1 : ''));
	return new Response(css, { status: 200, headers: { 'Content-Type': 'text/css' } });
};
