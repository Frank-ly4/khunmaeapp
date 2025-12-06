# Focus and Scope - StallLedger v1

This document clearly defines what is **IN SCOPE** for v1 and what is explicitly **OUT OF SCOPE** to prevent feature creep and maintain focus.

## ✅ IN SCOPE for v1

### Core Functionality

1. **Item Management**
   - Create, edit, delete items/products
   - Set default sale price per item
   - Optional category and photo
   - Unit specification (bowl, cup, piece, etc.)

2. **Purchase Tracking (Stock In)**
   - Log purchase batches with:
     - Item reference
     - Quantity purchased
     - Total cost
     - Purchase date
     - Optional note
   - Used for calculating average cost per unit

3. **Sales Transaction Logging**
   - Record each sale as a transaction with:
     - Item sold
     - Quantity sold
     - Sale price per unit (can override default)
     - Payment method (CASH / PROMPTPAY / OTHER)
     - Sale date/time
     - Optional note
   - **Important**: We do NOT track cash tendered or change given - just the sale details

4. **Overhead Expense Tracking**
   - Log expenses by category (rent, stall fee, electricity, labor, etc.)
   - Amount and date
   - Optional note

5. **Profit Calculations**
   - Average cost per unit calculation (simple moving average)
   - Cost of goods sold (COGS) per sale
   - Gross profit per sale and per period
   - Net profit (gross profit - overhead)
   - Net margin percentage

6. **Analytics & Reporting**
   - Daily summaries (revenue, COGS, gross profit, overhead, net profit, margin %)
   - Weekly summaries
   - Monthly summaries
   - Time-of-day analysis (hour buckets, e.g., 08:00-09:00)
   - Day-of-week analysis (Monday-Sunday)
   - Best/worst time and day identification
   - Average profit/loss over time (THB and %)

7. **User Interface**
   - Bottom tab navigation (Dashboard, Items, Sales, Expenses, Settings)
   - Dashboard with key metrics and quick actions
   - Transaction log view (Sales screen)
   - Simple forms for data entry
   - Empty states for new users
   - Basic validation and error handling

8. **Data Storage**
   - Local-only SQLite database
   - No cloud sync or backup
   - Data persists on device

9. **Platform Support**
   - Android only (phones)
   - Development on Windows with Android Studio AVD
   - Testing via Expo Go on physical Android devices

10. **Settings**
    - Stall name and owner name
    - Currency (default: THB)
    - Optional PromptPay ID (for future QR generation)

### Optional Nice-to-Have (if time permits)

- Basic PromptPay QR code generator (static payload, no real bank integration)
- Simple charts on dashboard (using Victory Native)

## ❌ OUT OF SCOPE for v1

### Authentication & Multi-User
- User accounts or login
- Multi-user support
- User profiles or preferences per user

### Cloud & Sync
- Cloud storage or sync
- Automatic backups
- Data export to cloud services
- Multi-device synchronization

### Advanced Inventory
- FIFO (First In, First Out) inventory method
- LIFO (Last In, First Out) inventory method
- Batch-level tracking (tracking specific purchase batches)
- Expiration date tracking
- Low stock alerts

### Payment Integration
- Real-time bank integration
- Actual PromptPay payment processing
- Payment gateway connections
- Receipt generation with payment details

### Advanced Features
- Multi-language support (English only for v1)
- Receipt/PDF generation
- Email reports
- Data export to CSV/Excel
- Barcode scanning
- Inventory forecasting
- Supplier management
- Tax calculations
- Multiple currency support (THB only)

### Platform Expansion
- iOS support
- Web version
- Desktop application

### Advanced Analytics
- Predictive analytics
- Trend forecasting
- Comparative period analysis (year-over-year)
- Custom date range reports
- Advanced filtering and search

### UI/UX Enhancements
- Dark mode
- Customizable themes
- Widgets/home screen integration
- Notifications/alerts
- Onboarding tutorial

## Scope Boundaries

### What Makes v1 "Complete"

v1 is considered complete when:
1. ✅ All core CRUD operations work (Items, Purchases, Sales, Overheads)
2. ✅ Profit calculations are accurate and match the documented formulas
3. ✅ Dashboard shows meaningful summaries (today, week, month)
4. ✅ Time-of-day and day-of-week analytics work correctly
5. ✅ App runs smoothly on Android emulator and physical device
6. ✅ Basic error handling and validation are in place
7. ✅ Documentation is complete and accurate

### What Can Wait

Features that enhance the experience but aren't critical for v1:
- Advanced filtering and search
- Data export
- Receipt generation
- Multi-language support
- Dark mode
- Advanced charts

These can be added in future versions based on user feedback.

## Decision Framework

When evaluating whether to add a feature to v1, ask:

1. **Is it essential for vendors to track profit?** (If no → out of scope)
2. **Does it require backend/cloud infrastructure?** (If yes → out of scope)
3. **Does it add significant complexity?** (If yes → consider deferring)
4. **Can it be built in a few hours?** (If no → likely out of scope)
5. **Does it align with "simple profit tracker" vision?** (If no → out of scope)

## Version Philosophy

**v1 = MVP (Minimum Viable Product)**

Focus on:
- Core functionality that solves the primary problem
- Simple, reliable implementation
- Clear, maintainable code
- Good enough UX (not perfect, but functional)

Future versions can add:
- Polish and refinements
- Advanced features
- Platform expansion
- Integration capabilities

