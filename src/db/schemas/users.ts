import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
    id: integer('id').primaryKey(),
    securityNumber: text('securityNumber').notNull().unique(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    password: text('password').notNull(),
});

export type User = typeof users.$inferSelect;
