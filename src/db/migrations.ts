import * as SQLite from 'expo-sqlite';

export const runMigrations = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  const statements = [
    `
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        defaultSalePrice REAL NOT NULL,
        unit TEXT NOT NULL,
        photoUri TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS purchase_batches (
        id TEXT PRIMARY KEY,
        itemId TEXT NOT NULL,
        quantityPurchased REAL NOT NULL,
        totalCost REAL NOT NULL,
        purchaseDate TEXT NOT NULL,
        note TEXT,
        FOREIGN KEY (itemId) REFERENCES items(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        itemId TEXT NOT NULL,
        quantitySold REAL NOT NULL,
        salePricePerUnit REAL NOT NULL,
        totalRevenue REAL NOT NULL,
        saleDateTime TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        note TEXT,
        FOREIGN KEY (itemId) REFERENCES items(id)
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS overhead_expenses (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        expenseDate TEXT NOT NULL,
        note TEXT
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        stallName TEXT NOT NULL,
        ownerName TEXT NOT NULL,
        currency TEXT NOT NULL,
        promptpayId TEXT,
        language TEXT
      );
    `,
    `CREATE INDEX IF NOT EXISTS idx_purchase_batches_itemId ON purchase_batches(itemId);`,
    `CREATE INDEX IF NOT EXISTS idx_sales_itemId ON sales(itemId);`,
    `CREATE INDEX IF NOT EXISTS idx_sales_saleDateTime ON sales(saleDateTime);`,
    `CREATE INDEX IF NOT EXISTS idx_overhead_expenses_expenseDate ON overhead_expenses(expenseDate);`
  ];

  try {
    for (const sql of statements) {
      await db.execAsync(sql);
    }

    // Ensure the `language` column exists on the settings table for existing installs
    const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(settings);');
    const hasLanguageColumn = columns.some((col) => col.name === 'language');

    if (!hasLanguageColumn) {
      await db.execAsync(`ALTER TABLE settings ADD COLUMN language TEXT;`);
    }
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};
