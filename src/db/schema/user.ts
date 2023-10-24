import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";


export const countries = sqliteTable('user', {
    id: integer('id').primaryKey(),
    guid: text('guid').unique(),
    socialID: text('socialID').unique(),
    firstName: text('firstName'),
    lastName: text('lastName'),
    mdp: text('mdp'),
    sex: text('sex')
});
 