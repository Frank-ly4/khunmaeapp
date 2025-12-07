# Project Status & Roadmap - StallLedger

**Last Updated:** December 7, 2025

## 📊 Current State
**Phase:** Milestone 4 (Polish, Testing & Build)
**Build Status:** Expo SDK 51 / React Native 0.74
**Platform:** Android (Primary)

## ✅ Completed Milestones

### Milestone 1: Setup & Architecture
- [x] Project scaffolded with Expo + TypeScript
- [x] Navigation (Tab + Stack) implemented
- [x] Theme and UI components (NativeBase) configured
- [x] Docker containerization setup (`Dockerfile`, `docker-compose`)
- [x] Windows development environment documentation

### Milestone 2: Data Layer & CRUD
- [x] SQLite database initialized with schema (Items, Purchases, Sales, Overheads, Settings)
- [x] CRUD operations fully implemented for all entities
- [x] Hooks (`useItems`, `useSales`, etc.) created and wired
- [x] Forms with validation working
- [x] Image picker for items implemented

### Milestone 3: Analytics & Dashboard
- [x] Profit calculation logic (moving average COGS, gross/net profit)
- [x] Dashboard screen showing real-time data (Today/Week/Month)
- [x] Charts (Victory Native) visualizing profit trends
- [x] Best/Worst insights (Time of Day / Day of Week)

## 🔄 In Progress: Milestone 4 (Polish & Testing)

### Completed Tasks in M4
- [x] **Language Support**: English/Thai translation system (`src/i18n`), first-run language picker, Settings toggle.
- [x] **PromptPay Helper**: Input field in Settings, display helper string.
- [x] **Build Configuration**: EAS Build setup (`eas.json`), fixed assets (icon/splash).

### Remaining Tasks (To-Do)
- [ ] **Build Verification**: Confirm `eas build --platform android --profile preview` produces a valid APK.
- [ ] **Manual Testing**: Execute `docs/TEST_PLAN.md` on emulator/device.
- [ ] **Final Polish**: Address any UI/UX issues found during testing.

## 🛠 Technical Notes

### Build & Deployment
- **Command**: `eas build --platform android --profile preview`
- **Artifact**: APK (install via `adb install`)
- **Prerequisites**: Valid `assets/icon.png` and `assets/splash.png` (fixed).

### Environment
- **Node Version**: 18 (enforced via Docker/engines)
- **Expo SDK**: 51
- **Database**: `expo-sqlite` ~14.0.3 (using `openDatabaseSync`)

## 📝 Next Session Goals
1. Check build status of the APK.
2. Install APK on emulator and verify standalone app behavior.
3. Run through the Test Plan (especially Thai language flows).
4. Mark project as v1.0 Release Candidate.

