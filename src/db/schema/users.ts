import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable('user', {
    id: integer('id').primaryKey(),
    securityNumber: text('securityNumber').notNull().unique(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    password: text('password').notNull()
});

export type User = typeof users.$inferSelect;

const selectUserSchema = createSelectSchema(users);

export const signUpUserSchema = createInsertSchema(users).omit({
    id: true
});

export const signInUserSchema = selectUserSchema.pick({
    securityNumber: true,
    password: true
});