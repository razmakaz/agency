import { desc, lte } from "drizzle-orm"
import { db } from ".."
import { terms_of_services } from "../schema"


export const terms_of_services_repo = {
    getLatest: async () =>  {
        return await db.select().from(terms_of_services).where(lte(terms_of_services.effective_date, new Date()))
        .orderBy(desc(terms_of_services.created_at))
    }
}