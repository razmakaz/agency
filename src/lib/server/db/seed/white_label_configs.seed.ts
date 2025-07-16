import { db } from '$lib/server/db';
import { white_label_configs, type WhiteLabelConfigs } from '../schema';

export const seed_white_label_configs = async () => {
    const payload = [
        {
            id: '9172dde9-1277-4405-85db-76b456161edd',
            organization_id: "64d242b9-a8e5-49b4-8534-a9269a6edd3c",
            header_font: 'Inter',
            body_font: 'Poppins',

            primary_color: '#0c070a',
            on_primary_color: '#fffff',

            secondary_color: '#3b2ed1',
            on_secondary_color: '#fbfcff',

            surface_color: '#149aeb',
            on_surface_color: '#050910',

            logo_url: 'https://placehold.co/400',
            logo_dark_url: 'https://placehold.co/400',
            logo_light_url: 'https://placehold.co/400',
            favicon_url: 'https://placehold.co/400',

            brand_name: 'Agency',
            brand_tagline: 'Get it done',

            custom_domain: 'http://localhost:3000',
            subdomain: 'http://subdomain.localhost:3000',

            website_url: 'http://localhost:3000'
        }
    ];
    const whiteLabelConfigs: WhiteLabelConfigs[] = [];
    for await (const whiteLabel of payload) {
        try {
            const inserted = await db.insert(white_label_configs).values(whiteLabel).returning();
            whiteLabelConfigs.push(...inserted);
        } catch (err) {
            console.error('Error seeding organizations:', err);
        }
    }

    whiteLabelConfigs.forEach((label) => {
        console.log(`Seeded white label config ${label.brand_name} (${label.id})`);
    });
};