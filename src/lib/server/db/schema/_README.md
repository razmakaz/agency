Standard for creating schemas: 

Example Schema following the standard: 
```
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { defaultSchemaRows } from '../../default.schema';

export const ApprovalsModelName = 'approvals';
export const approvals = pgTable(ApprovalsModelName, {
	...defaultSchemaRows,
	approved_by: text('approved_by').references(() => Contact.id),
	approved_at: timestamp('approved_at')
});
export type Approvals = typeof Approvals.$inferSelect;
export type ApprovalsInsert = typeof Approvals.$inferInsert;
```

1. Schemas should be pluralized and lower snake case. Example: my_objects

2. Don't put the name of the schema in pgTable's arguments. Instead, create an exported variable. 
- This is used for audit logs and non-related, cross-table references, like those found in the notebooks table.

3. Always include and spread the default schema rows. 

4. If a field is going to be used as a dropdown, drive the field's type by an exported object instead. 
```
export const Entities = {
    TYPE_A: {
        name: "Type A",
    },
    TYPE_B: {
        name: "Type B",
        meta: "data"
    }
}
export type MyEntityType = keyof typeof Entities; // Creates a type of ("TYPE_A" | "TYPE_B")
```

5. ALWAYS Export the $inferred select and insert types after defining your table. 