import Database from 'bun:sqlite';
import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export class DatabaseSingleton {
    public db: BunSQLiteDatabase;
    private static instance: DatabaseSingleton;

    private constructor() {
        const sqlite = new Database('database.sqlite');
        this.db = drizzle(sqlite);
        migrate(this.db, { migrationsFolder: 'migrations' });
    }

    public static getInstance(): DatabaseSingleton {
        if (!DatabaseSingleton.instance) {
            DatabaseSingleton.instance = new DatabaseSingleton();
        }
        return DatabaseSingleton.instance;
    }
}
