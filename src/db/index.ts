import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    db = SQLite.openDatabase('stallledger.db');
  }
  return db;
};

export const initDatabase = async (): Promise<void> => {
  const database = getDatabase();
  const { runMigrations } = await import('./migrations');
  await runMigrations(database);
};
