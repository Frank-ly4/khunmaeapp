# Data Model - StallLedger

This document describes the database schema, data models, and relationships for StallLedger v1.

## Database Overview

StallLedger uses **Expo SQLite** for local data storage. The database is initialized on app startup and persists data locally on the device.

## Tables

### 1. items

Stores product/item information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 |
| name | TEXT | NOT NULL | Item name (e.g., "Pad Thai") |
| category | TEXT | NULL | Optional category |
| defaultSalePrice | REAL | NOT NULL | Default sale price in THB |
| unit | TEXT | NOT NULL | Unit of measurement (e.g., "bowl", "cup") |
| photoUri | TEXT | NULL | Local file path to item photo |
| createdAt | TEXT | NOT NULL | ISO 8601 timestamp |
| updatedAt | TEXT | NOT NULL | ISO 8601 timestamp |

**Indexes**: None (small table, queries by id)

**Example**:
```sql
INSERT INTO items (id, name, category, defaultSalePrice, unit, createdAt, updatedAt)
VALUES ('uuid-123', 'Pad Thai', 'Main Dish', 80.00, 'bowl', '2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z');
```

### 2. purchase_batches

Stores stock purchase records (stock in).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 |
| itemId | TEXT | NOT NULL | Foreign key to items.id |
| quantityPurchased | REAL | NOT NULL | Quantity purchased |
| totalCost | REAL | NOT NULL | Total cost in THB |
| purchaseDate | TEXT | NOT NULL | ISO 8601 date |
| note | TEXT | NULL | Optional note |

**Indexes**: 
- `idx_purchase_batches_itemId` on `itemId`

**Example**:
```sql
INSERT INTO purchase_batches (id, itemId, quantityPurchased, totalCost, purchaseDate)
VALUES ('uuid-456', 'uuid-123', 10.0, 500.00, '2024-01-01T00:00:00Z');
```

### 3. sales

Stores sales transaction log (stock out / revenue).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 |
| itemId | TEXT | NOT NULL | Foreign key to items.id |
| quantitySold | REAL | NOT NULL | Quantity sold |
| salePricePerUnit | REAL | NOT NULL | Sale price per unit (can override item default) |
| totalRevenue | REAL | NOT NULL | Calculated: quantitySold × salePricePerUnit |
| saleDateTime | TEXT | NOT NULL | ISO 8601 timestamp |
| paymentMethod | TEXT | NOT NULL | 'CASH', 'PROMPTPAY', or 'OTHER' |
| note | TEXT | NULL | Optional note |

**Indexes**: 
- `idx_sales_itemId` on `itemId`
- `idx_sales_saleDateTime` on `saleDateTime`

**Example**:
```sql
INSERT INTO sales (id, itemId, quantitySold, salePricePerUnit, totalRevenue, saleDateTime, paymentMethod)
VALUES ('uuid-789', 'uuid-123', 2.0, 80.00, 160.00, '2024-01-01T12:00:00Z', 'CASH');
```

### 4. overhead_expenses

Stores operating expenses (rent, stall fees, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID v4 |
| category | TEXT | NOT NULL | Expense category (e.g., "rent", "stall fee") |
| amount | REAL | NOT NULL | Expense amount in THB |
| expenseDate | TEXT | NOT NULL | ISO 8601 date |
| note | TEXT | NULL | Optional note |

**Indexes**: 
- `idx_overhead_expenses_expenseDate` on `expenseDate`

**Example**:
```sql
INSERT INTO overhead_expenses (id, category, amount, expenseDate)
VALUES ('uuid-abc', 'rent', 2000.00, '2024-01-01T00:00:00Z');
```

### 5. settings

Stores app configuration (single row).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Always '1' (single row) |
| stallName | TEXT | NOT NULL | Stall name |
| ownerName | TEXT | NOT NULL | Owner name |
| currency | TEXT | NOT NULL | Currency code (default: 'THB') |
| promptpayId | TEXT | NULL | Optional PromptPay ID |

**Example**:
```sql
INSERT INTO settings (id, stallName, ownerName, currency)
VALUES ('1', 'My Food Stall', 'John Doe', 'THB');
```

## Relationships

### Foreign Keys (Logical)

- `purchase_batches.itemId` → `items.id`
- `sales.itemId` → `items.id`

**Note**: SQLite does not enforce foreign key constraints by default. Relationships are maintained logically in the application code.

## Data Flow

### Creating a Sale Transaction

1. User selects an item from `items` table
2. User enters quantity and sale price (defaults from item)
3. System calculates `totalRevenue = quantitySold × salePricePerUnit`
4. System creates record in `sales` table with current timestamp

### Calculating Cost of Goods Sold (COGS)

For a given item:
1. Query all `purchase_batches` for that `itemId`
2. Calculate average cost per unit:
   ```
   avgCostPerUnit = SUM(totalCost) / SUM(quantityPurchased)
   ```
3. For each sale:
   ```
   cogsForSale = quantitySold × avgCostPerUnit
   ```

### Profit Calculation

For a given period:
1. **Total Revenue**: `SUM(totalRevenue)` from `sales` where `saleDateTime` in period
2. **Total COGS**: `SUM(cogsForSale)` for all sales in period
3. **Gross Profit**: `totalRevenue - totalCOGS`
4. **Total Overhead**: `SUM(amount)` from `overhead_expenses` where `expenseDate` in period
5. **Net Profit**: `grossProfit - totalOverhead`
6. **Net Margin %**: `(netProfit / totalRevenue) × 100` (if revenue > 0)

## TypeScript Interfaces

All models are defined in `src/models/index.ts`:

```typescript
interface Item {
  id: string;
  name: string;
  category?: string;
  defaultSalePrice: number;
  unit: string;
  photoUri?: string;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseBatch {
  id: string;
  itemId: string;
  quantityPurchased: number;
  totalCost: number;
  purchaseDate: string;
  note?: string;
}

type PaymentMethod = 'CASH' | 'PROMPTPAY' | 'OTHER';

interface Sale {
  id: string;
  itemId: string;
  quantitySold: number;
  salePricePerUnit: number;
  totalRevenue: number;
  saleDateTime: string;
  paymentMethod: PaymentMethod;
  note?: string;
}

interface OverheadExpense {
  id: string;
  category: string;
  amount: number;
  expenseDate: string;
  note?: string;
}

interface Settings {
  id: string;
  stallName: string;
  ownerName: string;
  currency: string;
  promptpayId?: string;
}
```

## Query Patterns

### Get All Sales with Item Names

```sql
SELECT s.*, i.name as itemName
FROM sales s
LEFT JOIN items i ON s.itemId = i.id
ORDER BY s.saleDateTime DESC;
```

### Get Sales by Date Range

```sql
SELECT *
FROM sales
WHERE saleDateTime >= ? AND saleDateTime <= ?
ORDER BY saleDateTime DESC;
```

### Get Purchase Batches with Item Names

```sql
SELECT pb.*, i.name as itemName
FROM purchase_batches pb
LEFT JOIN items i ON pb.itemId = i.id
ORDER BY pb.purchaseDate DESC;
```

### Calculate Average Cost Per Unit for an Item

```sql
SELECT 
  SUM(totalCost) / SUM(quantityPurchased) as avgCostPerUnit
FROM purchase_batches
WHERE itemId = ?;
```

## Data Access Layer

All database operations are encapsulated in typed functions in `src/db/`:

- `src/db/items.ts` - Item CRUD operations
- `src/db/purchaseBatches.ts` - Purchase batch operations
- `src/db/sales.ts` - Sale operations
- `src/db/overheadExpenses.ts` - Overhead expense operations
- `src/db/settings.ts` - Settings operations

## Migration System

Database schema is created via migrations in `src/db/migrations.ts`. The migration runs on app initialization (`src/db/index.ts`).

## Profit Calculation Examples

### Example 1: Simple COGS Calculation

**Scenario**: Vendor buys ingredients and sells dishes

1. **Purchase**: Buy 10kg of noodles for ฿500
   - Item: "Pad Thai"
   - Quantity: 10 kg
   - Total Cost: ฿500
   - Average Cost Per Unit: ฿500 / 10 = ฿50 per kg

2. **Sale**: Sell 2 bowls of Pad Thai
   - Quantity Sold: 2 bowls
   - Sale Price Per Unit: ฿80 per bowl
   - Total Revenue: ฿160
   - COGS: 2 bowls × (฿50/kg × assumed 0.2kg per bowl) = ฿20
   - Gross Profit: ฿160 - ฿20 = ฿140

### Example 2: Period Summary Calculation

**Scenario**: Calculate weekly profit

**Sales This Week**:
- Sale 1: Revenue ฿160, COGS ฿20 → Gross Profit ฿140
- Sale 2: Revenue ฿240, COGS ฿30 → Gross Profit ฿210
- Sale 3: Revenue ฿80, COGS ฿10 → Gross Profit ฿70

**Totals**:
- Total Revenue: ฿480
- Total COGS: ฿60
- Gross Profit: ฿420

**Overhead This Week**:
- Rent: ฿200
- Electricity: ฿50
- Total Overhead: ฿250

**Final Calculation**:
- Net Profit: ฿420 - ฿250 = ฿170
- Net Margin %: (฿170 / ฿480) × 100 = 35.4%

### Example 3: Multiple Purchases (Moving Average)

**Scenario**: Vendor buys ingredients multiple times at different prices

**Purchases for "Pad Thai"**:
- Purchase 1: 10kg @ ฿500 (฿50/kg)
- Purchase 2: 5kg @ ฿300 (฿60/kg)
- Purchase 3: 15kg @ ฿750 (฿50/kg)

**Average Cost Calculation**:
- Total Cost: ฿500 + ฿300 + ฿750 = ฿1,550
- Total Quantity: 10 + 5 + 15 = 30 kg
- Average Cost Per Unit: ฿1,550 / 30 = ฿51.67 per kg

**Sale**:
- Quantity Sold: 2 bowls (assumed 0.2kg per bowl = 0.4kg total)
- COGS: 0.4kg × ฿51.67/kg = ฿20.67

### Example 4: Time-Based Analytics

**Scenario**: Analyze sales by time of day

**Sales Data** (Last Week):
- 08:00-09:00: 5 sales, Revenue ฿400, COGS ฿50, Net Profit ฿350
- 12:00-13:00: 15 sales, Revenue ฿1,200, COGS ฿150, Net Profit ฿1,050
- 18:00-19:00: 20 sales, Revenue ฿1,600, COGS ฿200, Net Profit ฿1,400

**Insights**:
- Best Hour: 18:00-19:00 (Net Profit: ฿1,400)
- Worst Hour: 08:00-09:00 (Net Profit: ฿350)

**Day of Week Analysis**:
- Monday: Net Profit ฿500
- Friday: Net Profit ฿800
- Saturday: Net Profit ฿1,200 (Best Day)
- Sunday: Net Profit ฿300 (Worst Day)

## Step-by-Step Calculation Walkthrough

### Calculating Profit for a Single Sale

1. **Get Item's Average Cost Per Unit**:
   ```sql
   SELECT SUM(totalCost) / SUM(quantityPurchased) as avgCost
   FROM purchase_batches
   WHERE itemId = 'item-123';
   ```
   Result: ฿50 per unit

2. **Calculate COGS for Sale**:
   ```
   COGS = quantitySold × avgCostPerUnit
   COGS = 2 × ฿50 = ฿100
   ```

3. **Calculate Gross Profit**:
   ```
   Gross Profit = totalRevenue - COGS
   Gross Profit = ฿160 - ฿100 = ฿60
   ```

### Calculating Period Summary

1. **Get All Sales in Period**:
   ```sql
   SELECT * FROM sales
   WHERE saleDateTime >= '2024-01-01T00:00:00Z'
     AND saleDateTime <= '2024-01-07T23:59:59Z';
   ```

2. **For Each Sale**:
   - Calculate COGS (using average cost per unit)
   - Calculate Gross Profit

3. **Aggregate Totals**:
   - Total Revenue = SUM(totalRevenue)
   - Total COGS = SUM(COGS for each sale)
   - Gross Profit = Total Revenue - Total COGS

4. **Get Overhead Expenses**:
   ```sql
   SELECT SUM(amount) as totalOverhead
   FROM overhead_expenses
   WHERE expenseDate >= '2024-01-01'
     AND expenseDate <= '2024-01-07';
   ```

5. **Calculate Net Profit**:
   ```
   Net Profit = Gross Profit - Total Overhead
   ```

6. **Calculate Net Margin %**:
   ```
   Net Margin % = (Net Profit / Total Revenue) × 100
   ```

## Notes

- All timestamps use ISO 8601 format (e.g., `2024-01-01T12:00:00.000Z`)
- All IDs are UUID v4 strings generated client-side
- Photo URIs are local file paths (handled by Expo ImagePicker)
- Currency amounts are stored as REAL (floating point) numbers
- Foreign key relationships are logical (not enforced by SQLite)
- COGS uses simple moving average (not FIFO/LIFO)
- Overhead expenses are distributed evenly across all sales in a period for time-based analytics

