# StallLedger - Simple Profit Tracker for Stall Vendors

A portfolio-quality Android app built with React Native and Expo, designed to help small food and market stall vendors track sales, costs, and profit.

## Features

- **Transaction Logging**: Record each sale with item, quantity, price, and payment method
- **Inventory Management**: Track stock purchases and items
- **Expense Tracking**: Log overhead expenses (rent, stall fees, etc.)
- **Profit Analytics**: Calculate gross profit, net profit, and margins
- **Time-based Insights**: Analyze performance by time of day and day of week

## Tech Stack

- React Native with Expo
- TypeScript
- NativeBase (UI components)
- Victory Native (charts)
- Expo SQLite (local database)
- React Navigation (bottom tabs)

## Quick Start

### Option 1: Docker (Recommended for Portability)

For a fully containerized development environment that works consistently across all machines:

**Prerequisites**: Docker Desktop installed and running

```bash
# Build and start the container
docker-compose up --build

# Access Expo DevTools at http://localhost:19002
# Scan QR code with Expo Go app
```

See `DOCKER_SETUP.md` for detailed Docker instructions and troubleshooting.

### Option 2: Local Installation

**Prerequisites**:
- Node.js (v18 or later)
- Android Studio with AVD (for emulator)
- Expo Go app (for physical device testing)

**Installation**:

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on Android:
   - **Emulator**: Press `a` in the Expo CLI
   - **Physical Device**: Scan QR code with Expo Go app (same network)

See `docs/SETUP_WINDOWS_ANDROID.md` for detailed Windows setup instructions.

## Project Structure

```
src/
  screens/       # Main app screens
  components/    # Reusable UI components
  db/            # SQLite database layer
  models/        # TypeScript types/interfaces
  services/      # Business logic (profit calc, analytics)
  hooks/         # Custom React hooks
  utils/         # Helper functions
  theme/         # App theme configuration
  navigation/    # Navigation setup
```

## Documentation

- `DOCKER_SETUP.md` - Docker containerization guide
- `docs/PRODUCT_OVERVIEW.md` - Product concept and target users
- `docs/FOCUS_AND_SCOPE.md` - v1 scope and non-goals
- `docs/SETUP_WINDOWS_ANDROID.md` - Windows development setup guide
- `docs/DATA_MODEL.md` - Database schema and relationships

## Development Milestones

- **Milestone 1**: Project setup & navigation ✅
- **Milestone 2**: Data layer & CRUD operations ✅
- **Milestone 3**: Analytics & dashboard ✅
- **Milestone 4**: UI polish & PromptPay helper

## License

Private project - Portfolio use

