import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('user', {
    id: integer('id').primaryKey(),
    securityNumber: text('securityNumber').unique(),
    firstName: text('firstName'),
    lastName: text('lastName'),
    password: text('password')
});

export type User = typeof users.$inferSelect;