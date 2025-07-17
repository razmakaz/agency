import { seed } from '$lib/server/db/seed';

// Refer to /src/lib/server/db/seed/_README.md for more information.
export const GET = async ({ url }) => {
	const showErrors = url.searchParams.get('showErrors') === 'true';

	await seed(showErrors)
		.then((res) => {
			return new Response('Database seeded successfully!', { status: 200 });
		})
		.catch((err) => {
			return new Response(err.message, { status: 500 });
		});

	return new Response('Database seeded successfully!', { status: 200 });
};
