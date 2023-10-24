import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const users = sqliteTable('user', {
    id: integer('id').primaryKey(),
    securityNumber: text('securityNumber').notNull().unique(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    password: text('password').notNull()
});

export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users, {
    id: (schema) => schema.id.optional()
});