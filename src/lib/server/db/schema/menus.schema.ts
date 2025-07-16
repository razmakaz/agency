import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { defaultSchemaFields } from '../default.schema';

export enum MenuType {
	LINK = 'link',
	BUTTON = 'button'
}

export const MenusModelName = 'menus';

export const menus = pgTable(MenusModelName, {
	...defaultSchemaFields,
	name: text('name').notNull(),
	idleIcon: text('idle_icon').notNull(),
	activeIcon: text('active_icon').notNull(),
	type: text('type').$type<MenuType>().notNull().default(MenuType.LINK),
	href: text('href').notNull(),
	permissions: text('permissions').array().default([]),
	order: integer('order').notNull().default(0)
});

export type Menus = typeof menus.$inferSelect;
export type MenusInsert = typeof menus.$inferInsert;
