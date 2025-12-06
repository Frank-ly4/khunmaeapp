# Product Overview - StallLedger

## Working Title
**StallLedger – Simple Profit Tracker for Stall Vendors**

## Target Users

StallLedger is designed for **small food and market stall vendors** who currently track sales and expenses on paper. These vendors typically:

- Operate at street food stalls, night markets, or similar venues
- Use Android phones as their primary device
- Accept roughly 50/50 cash and PromptPay (Thai QR payments)
- Need simple, quick ways to log transactions without complex accounting

## Problem Statement

Small stall vendors struggle to:
- Track actual profit vs. revenue
- Understand which times and days are most profitable
- Calculate cost of goods sold (COGS) accurately
- See their net savings over time
- Make data-driven decisions about operations

Current solutions (paper notebooks, spreadsheets) are:
- Error-prone
- Time-consuming to analyze
- Don't provide real-time insights
- Difficult to calculate profit margins

## Solution

StallLedger provides a **simple, touch-friendly Android app** that:

1. **Logs every sale as a transaction** - Vendors record what was sold, quantity, price per unit, and payment method (no need to track cash tendered or change)

2. **Tracks inventory costs** - Log stock purchases to calculate average cost per unit

3. **Records overhead expenses** - Track rent, stall fees, wages, electricity, etc.

4. **Calculates real profit** - Automatically computes:
   - Revenue per period
   - Cost of goods sold (COGS)
   - Gross profit
   - Net profit (after overhead)
   - Net margin percentage

5. **Provides time-based analytics** - Shows:
   - Best/worst times of day for sales
   - Best/worst days of the week
   - Average profit/loss over time (in THB and %)

## Key Features (v1)

### Core Functionality
- **Item Management**: Add products with name, category, default price, unit, and optional photo
- **Purchase Logging**: Record stock purchases with quantity and total cost
- **Sales Transaction Log**: Record each sale with item, quantity, sale price, and payment method
- **Overhead Tracking**: Log operating expenses by category
- **Profit Calculation**: Automatic COGS, gross profit, and net profit calculations

### Analytics & Insights
- Daily/weekly/monthly revenue summaries
- Gross and net profit by period
- Net margin percentage
- Time-of-day performance analysis
- Day-of-week performance analysis
- Average profit/loss trends

### User Experience
- Simple, touch-friendly interface optimized for outdoor use
- Quick actions from dashboard
- Transaction log showing all sales
- Clear visual indicators for profit/loss

## Payment Methods

The app supports tracking three payment methods:
- **CASH** - Cash transactions
- **PROMPTPAY** - Thai QR code payments
- **OTHER** - Other payment methods

Note: v1 does not include real-time bank integration. PromptPay tracking is for logging purposes only. An optional QR code generator may be included for demo/portfolio purposes.

## Design Principles

1. **Simplicity First** - No complex accounting concepts, just straightforward profit tracking
2. **Speed** - Quick transaction logging without unnecessary steps
3. **Clarity** - Clear visual feedback on profit/loss status
4. **Offline-First** - Works entirely offline using local SQLite storage
5. **Android-Optimized** - Designed specifically for Android phones

## Success Metrics (v1)

A successful v1 should enable vendors to:
- Answer "How much did I actually make this week/month?" in under 30 seconds
- Identify their best performing days and times
- Understand their profit margins
- Make informed decisions about operations

## Future Considerations (Out of Scope for v1)

- Cloud sync and backups
- Multi-user/account support
- Advanced inventory methods (FIFO/LIFO)
- Real-time bank/PromptPay integration
- Multi-language support
- Receipt generation
- Export to spreadsheet/PDF

