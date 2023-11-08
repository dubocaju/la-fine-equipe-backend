import type { Config } from "drizzle-kit";

export default {
    schema: "src/db/schemas/*.ts",
    out: 'migrations',
    driver: 'better-sqlite',
    dbCredentials: {
        url: 'database.sqlite',
    }
} satisfies Config;