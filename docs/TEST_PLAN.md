# StallLedger Testing & QA Plan

## 1. Environment

- Device: Android emulator (API 33+), plus at least one physical Android phone with Expo Go.
- Build: Development build via `npm start` (Expo dev server).
- Data: Start with a fresh install for each major round of tests (uninstall app to reset DB).

## 2. Core Flows

### 2.1 Language Selection

- First run:
  - Launch app after install.
  - Verify language selection screen appears.
  - Choose English → UI texts (tab titles, Settings) show English.
  - Uninstall and reinstall; choose Thai → same screens show Thai labels.
- Change language in Settings:
  - Open Settings → change language between English/Thai.
  - Confirm tab labels and screen titles update after navigating back.

### 2.2 Items

- Create item:
  - Add item with name, category, price, unit.
  - Verify it appears in Items list with correct values.
- Edit item:
  - Open existing item, change name/price, save.
  - Verify list updates.
- Delete item:
  - Delete item via dialog → confirm removal from list.
- Empty state:
  - With no items, verify friendly empty message appears.

### 2.3 Purchases

- Add purchase:
  - From Expenses → Purchases, add purchase for an item.
  - Confirm quantity, cost, and date display correctly.
- List behaviour:
  - Pull-to-refresh updates list.
  - Empty state text is shown when there are no purchases.

### 2.4 Sales

- Add sale:
  - From Sales tab, add sale for an existing item.
  - Verify quantity, price, and total revenue are correct.
- Payment methods:
  - Record sales using CASH, PROMPTPAY, OTHER.
  - Confirm badges show the correct method.
- Transaction log:
  - Check date/time formatting and ordering.

### 2.5 Overheads

- Add overhead expense:
  - From Expenses → Overheads, add an expense with category, amount, date, note.
  - Verify list entry and date.
- Navigation:
  - Use the Purchases/Overheads toggle buttons to switch views.

### 2.6 Settings

- Stall information:
  - Set stall name, owner name, currency; save.
  - Kill and relaunch app → values persist.
- PromptPay:
  - Enter PromptPay ID; save and relaunch → value persists.
- Language:
  - Change language and verify main screens reflect the selection.

## 3. Dashboard & Analytics

### 3.1 Profit Calculations

- Single-item scenario:
  - Create one item.
  - Add one purchase batch (e.g., 10 units, 500 THB total).
  - Add one sale (e.g., 2 units at 80 THB each).
  - Verify:
    - Revenue = 160 THB.
    - COGS = 2 × (500 / 10) = 100 THB.
    - Gross profit = 60 THB.
    - Net profit = gross profit – overheads (if any).
- Multi-item scenario:
  - Add multiple purchases and sales for same and different items.
  - Check that period summaries (Today/Week/Month) match manual spreadsheet calculations.

### 3.2 Date Ranges

- Today:
  - Create sales and expenses today only.
  - Confirm Today summary includes only today’s data.
- This Week / This Month:
  - Backdate some entries (if UI allows) or adjust device date/time for testing.
  - Confirm that week/month summaries include appropriate records.

### 3.3 Trend Chart

- With at least 3–7 days of sample data (by adjusting device date or seeding data):
  - Verify the Profit Trend chart displays daily net profit.
  - Check axis labels and that negative profits render below zero.

## 4. Edge Cases & Error Handling

- Zero purchases, positive sales:
  - Record a sale without any purchase batches.
  - Confirm COGS is treated as 0 and gross profit equals revenue.
- Zero revenue:
  - No sales in the selected period; dashboard should not crash and should show zeros or “no data” where appropriate.
- Negative profits:
  - High overheads vs. low revenue → net profit negative; verify red coloring and correct values.
- Validation:
  - Try saving forms with empty required fields or invalid numbers; confirm errors or disabled save behaviour where implemented.

## 5. Performance & UX

- Scrolling:
  - Large lists of items/sales/purchases/overheads scroll smoothly on emulator and physical device.
- Refresh:
  - Pull-to-refresh on listings works and doesn’t flicker.
- Launch time:
  - App launches to Dashboard (or language selection on first run) within a reasonable time on a mid-range device.

## 6. Issue Logging

Use a simple structure (e.g., `docs/TEST_ISSUES.md`) to record any problems:

- ID / Date
- Area (Items, Sales, Dashboard, Localization, etc.)
- Steps to Reproduce
- Expected vs Actual
- Priority: P0 (must fix), P1 (should fix), P2 (nice-to-have)

This document will guide future bug-fixing and polish passes.


