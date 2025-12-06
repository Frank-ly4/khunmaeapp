import * as SQLite from 'expo-sqlite';

export const runMigrations = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.execAsync(
      [
        {
          sql: `
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
          args: [],
        },
        {
          sql: `
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
          args: [],
        },
        {
          sql: `
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
          args: [],
        },
        {
          sql: `
            CREATE TABLE IF NOT EXISTS overhead_expenses (
              id TEXT PRIMARY KEY,
              category TEXT NOT NULL,
              amount REAL NOT NULL,
              expenseDate TEXT NOT NULL,
              note TEXT
            );
          `,
          args: [],
        },
        {
          sql: `
            CREATE TABLE IF NOT EXISTS settings (
              id TEXT PRIMARY KEY,
              stallName TEXT NOT NULL,
              ownerName TEXT NOT NULL,
              currency TEXT NOT NULL,
              promptpayId TEXT
            );
          `,
          args: [],
        },
        {
          sql: `CREATE INDEX IF NOT EXISTS idx_purchase_batches_itemId ON purchase_batches(itemId);`,
          args: [],
        },
        {
          sql: `CREATE INDEX IF NOT EXISTS idx_sales_itemId ON sales(itemId);`,
          args: [],
        },
        {
          sql: `CREATE INDEX IF NOT EXISTS idx_sales_saleDateTime ON sales(saleDateTime);`,
          args: [],
        },
        {
          sql: `CREATE INDEX IF NOT EXISTS idx_overhead_expenses_expenseDate ON overhead_expenses(expenseDate);`,
          args: [],
        },
      ],
      false
    )
      .then(() => resolve())
      .catch((error) => reject(error));
  });
};
