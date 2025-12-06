# Setup Guide - Windows + Android Development

This guide walks you through setting up the development environment for StallLedger on Windows 10/11, including Android Studio emulator and Expo Go for physical device testing.

## Prerequisites Checklist

- [ ] Windows 10 or 11
- [ ] Administrator access (for some installations)
- [ ] Internet connection
- [ ] Android phone (optional, for physical device testing)

## Step 1: Install Node.js

1. Download Node.js LTS version from [nodejs.org](https://nodejs.org/)
2. Run the installer (`.msi` file)
3. **Important**: Check "Add to PATH" during installation
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```
   You should see version numbers (e.g., `v18.17.0` and `9.6.7`)

## Step 2: Install Git (if not already installed)

1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with default options
3. Verify installation:
   ```powershell
   git --version
   ```

## Step 3: Install Android Studio

1. Download Android Studio from [developer.android.com/studio](https://developer.android.com/studio)
2. Run the installer
3. During installation:
   - Select "Standard" installation type
   - Accept license agreements
   - Let it download Android SDK components (this may take 20-30 minutes)
4. Launch Android Studio after installation

### First-Time Android Studio Setup

1. **SDK Setup**:
   - Go to `File` → `Settings` → `Appearance & Behavior` → `System Settings` → `Android SDK`
   - Ensure "Android SDK Platform-Tools" and "Android SDK Build-Tools" are installed
   - Note the "Android SDK Location" path (usually `C:\Users\YourName\AppData\Local\Android\Sdk`)

2. **Set Environment Variables** (Important!):
   - Open Windows Settings → System → About → Advanced system settings
   - Click "Environment Variables"
   - Under "User variables", add/edit:
     - `ANDROID_HOME` = `C:\Users\YourName\AppData\Local\Android\Sdk` (your SDK path)
     - Add to `Path` variable:
       - `%ANDROID_HOME%\platform-tools`
       - `%ANDROID_HOME%\tools`
       - `%ANDROID_HOME%\tools\bin`
   - **Restart PowerShell/Command Prompt** after setting variables

3. **Verify ADB**:
   ```powershell
   adb --version
   ```
   Should show Android Debug Bridge version

## Step 4: Create Android Virtual Device (AVD)

1. In Android Studio, click "More Actions" → "Virtual Device Manager"
2. Click "Create Device"
3. Select a device (e.g., "Pixel 5" or "Pixel 6")
4. Click "Next"
5. Download a system image (e.g., "Tiramisu" API 33 or "UpsideDownCake" API 34)
6. Click "Next" → "Finish"
7. Click the ▶️ play button to start the emulator
8. Wait for the emulator to boot (first boot may take 2-3 minutes)

**Tip**: Keep the emulator running while developing to avoid cold starts.

## Step 5: Install Expo CLI and Project Dependencies

1. Open PowerShell in the project directory (`LedgerApp`)
2. Install project dependencies:
   ```powershell
   npm install
   ```
   This installs all packages from `package.json` (may take 5-10 minutes)

3. Verify Expo CLI:
   ```powershell
   npx expo --version
   ```

## Step 6: Start the Development Server

1. In PowerShell, run:
   ```powershell
   npm start
   ```
   Or:
   ```powershell
   npx expo start
   ```

2. You should see:
   - QR code in the terminal
   - Metro bundler starting
   - Options: `[a]` for Android, `[i]` for iOS, `[w]` for web

## Step 7: Run on Android Emulator

1. **Ensure your AVD is running** (started from Android Studio)
2. In the Expo CLI, press `a` (or type `a` and press Enter)
3. Wait for the app to build and launch (first build may take 2-3 minutes)
4. The app should open in your emulator

**Troubleshooting Emulator**:
- If `a` doesn't work, ensure ADB can see the emulator:
  ```powershell
  adb devices
  ```
  Should list your emulator (e.g., `emulator-5554`)
- If emulator isn't detected, restart the emulator and try again

## Step 8: Run on Physical Android Device (Expo Go)

### Option A: Same Network (Recommended)

1. **Install Expo Go** on your Android phone:
   - Open Google Play Store
   - Search "Expo Go"
   - Install the app

2. **Ensure phone and computer are on the same Wi-Fi network**

3. **Start Expo dev server**:
   ```powershell
   npm start
   ```

4. **Scan QR code**:
   - Open Expo Go app on your phone
   - Tap "Scan QR code"
   - Point camera at the QR code in PowerShell terminal
   - App should load

### Option B: Tunnel Mode (if same network doesn't work)

1. Start Expo with tunnel:
   ```powershell
   npx expo start --tunnel
   ```
   Note: Tunnel mode is slower but works across different networks.

2. Scan the QR code with Expo Go app

### Troubleshooting Physical Device

- **"Unable to connect"**: Ensure both devices are on the same Wi-Fi
- **QR code not scanning**: Try typing the URL manually in Expo Go
- **Slow loading**: Use tunnel mode or check network speed
- **App crashes**: Check Expo Go app version (update if needed)

## Step 9: Verify Setup

Run these commands to verify everything works:

```powershell
# Check Node.js
node --version

# Check npm
npm --version

# Check ADB (Android Debug Bridge)
adb --version

# Check Expo
npx expo --version

# List connected devices
adb devices
```

## Common Issues & Solutions

### Issue: `npx` or `node` not recognized
**Solution**: 
- Restart PowerShell after installing Node.js
- Verify Node.js is in PATH: `$env:PATH` should include Node.js path
- Reinstall Node.js with "Add to PATH" checked

### Issue: Android emulator not detected
**Solution**:
- Ensure emulator is running
- Check `adb devices` shows the emulator
- Restart ADB: `adb kill-server` then `adb start-server`
- Restart the emulator

### Issue: Expo start fails
**Solution**:
- Clear cache: `npx expo start -c`
- Delete `node_modules` and reinstall: `rm -r node_modules` then `npm install`
- Check firewall isn't blocking port 19000

### Issue: App won't load on physical device
**Solution**:
- Ensure same Wi-Fi network
- Try tunnel mode: `npx expo start --tunnel`
- Check phone's firewall/security settings
- Verify Expo Go app is up to date

### Issue: TypeScript errors
**Solution**:
- Run type check: `npm run type-check`
- Ensure `tsconfig.json` is correct
- Check all imports are correct

## Development Workflow

1. **Start emulator** (or have Expo Go ready on phone)
2. **Start dev server**: `npm start`
3. **Press `a`** for Android emulator (or scan QR for physical device)
4. **Make code changes** - app will hot reload automatically
5. **Check for errors** in terminal and device

## Next Steps

Once setup is complete:
- Review `docs/PRODUCT_OVERVIEW.md` for app concept
- Review `docs/FOCUS_AND_SCOPE.md` for v1 scope
- Start implementing Milestone 2: Data Layer & CRUD

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [NativeBase Documentation](https://docs.nativebase.io/)

## Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review Expo documentation
3. Check Android Studio logs
4. Verify all environment variables are set correctly

