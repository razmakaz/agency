import { pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';
import { organizations } from './organizations.schema';

export const WhiteLabelConfigsModelName = 'white_label_configs';

export const white_label_configs = pgTable(WhiteLabelConfigsModelName, {
	...defaultSchemaFields,
	organization_id: text('organization_id').references(() => organizations.id),

	header_font: text('header_font'),
	body_font: text('body_font'),

	primary_color: text('primary_color'),
	primary_content: text('primary_content'),

	secondary_color: text('secondary_color'),
	secondary_content: text('secondary_content'),

	logo_url: text('logo_url'),
	logo_dark_url: text('logo_dark_url'),
	logo_light_url: text('logo_light_url'),
	favicon_url: text('favicon_url'),

	brand_name: text('brand_name'),
	brand_tagline: text('brand_tagline'),

	custom_domain: text('custom_domain'),
	subdomain: text('subdomain'),

	website_url: text('website_url'),

	default_mode: text('default_mode').$type<'light' | 'dark'>().default('light')
});

export type WhiteLabelConfigs = typeof white_label_configs.$inferSelect;
export type WhiteLabelConfigsInsert = typeof white_label_configs.$inferInsert;
