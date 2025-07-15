import { desc } from "drizzle-orm"
import { db } from ".."
import { privacy_policies } from "../schema"



export const privacy_policies_repo = {
    getLatest: async () => {
        return await db.select().from(privacy_policies).where(desc(privacy_policies.created_at))
    }
}