import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const medicalActs = sqliteTable('medicalAct', {
    id: integer('id').primaryKey(),
    date : integer('date', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    place : text('place'),
    intervention : text('intervention').notNull(),
    comment : text('comment'),
    priceIntervention : real('priceIntervention').notNull(),
    priceSupported : real('priceSupported').notNull(),
    isConfirmed : integer('isConfirmed', { mode: 'boolean' }).default(sql`FALSE`),
    isPaid : integer('isPaid', { mode: 'boolean' }).default(sql`FALSE`)
});

export type MedAct = typeof medicalActs.$inferSelect;