import { seed } from '$lib/server/db/seed';

export const GET = async () => {
	return await seed()
		.then((res) => {
			return new Response('Database seeded successfully!', { status: 200 });
		})
		.catch((err) => {
			return new Response(err.message, { status: 500 });
		});
};
