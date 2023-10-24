import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('user', {
    id: integer('id').primaryKey(),
    socialID: text('socialID').unique(),
    firstName: text('firstName'),
    lastName: text('lastName'),
    password: text('password'),
    gender: text('gender')
});

export type Users = typeof users.$inferSelect;