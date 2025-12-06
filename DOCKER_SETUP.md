# Docker Setup Guide - StallLedger

This guide explains how to run StallLedger in a Docker container for a fully portable, consistent development environment.

## Prerequisites

- **Docker Desktop** installed and running
  - Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
  - Ensure Docker Desktop is running before proceeding
- **Docker Compose** (usually included with Docker Desktop)
- **Git** (for cloning the repository)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LedgerApp
```

### 2. Build and Start the Container

```bash
docker-compose up --build
```

This will:
- Build the Docker image with all dependencies
- Start the Expo development server
- Expose ports 19000, 19001, and 19002

### 3. Access Expo DevTools

Once the container is running, you'll see output like:

```
Metro waiting on exp://192.168.x.x:19000
```

Open your browser and navigate to:
- **Expo DevTools**: `http://localhost:19002`
- Or scan the QR code displayed in the terminal

### 4. Run on Android

**Option A: Android Emulator**
1. Start Android Studio and launch an AVD
2. In the Docker container terminal, press `a`
3. The app will build and launch in the emulator

**Option B: Physical Device (Expo Go)**
1. Install **Expo Go** app on your Android phone
2. Ensure your phone and computer are on the same Wi-Fi network
3. Scan the QR code from the terminal or Expo DevTools
4. The app will load on your device

## Stopping the Container

To stop the development server:

```bash
docker-compose down
```

To stop and remove volumes (clean slate):

```bash
docker-compose down -v
```

## Rebuilding After Changes

If you modify `package.json` or `Dockerfile`:

```bash
docker-compose up --build
```

The `--build` flag rebuilds the image with updated dependencies.

## VS Code Dev Container

If you use VS Code, you can develop entirely inside a container:

### Setup

1. Install the **Dev Containers** extension in VS Code
2. Open the project folder in VS Code
3. Press `F1` or `Ctrl+Shift+P` to open command palette
4. Select **"Dev Containers: Reopen in Container"**
5. Wait for the container to build (first time may take a few minutes)
6. Once inside the container, run:
   ```bash
   npm start
   ```

### Benefits

- Consistent environment across all developers
- No local Node.js installation needed
- Extensions pre-installed
- Ports automatically forwarded

## Network Configuration

### Host Network Mode (Linux/Mac)

The `docker-compose.yml` uses `network_mode: host` which allows:
- Expo Go on physical devices to connect easily
- No port mapping issues
- Direct network access

### Bridge Network Mode (Windows Alternative)

On Windows, `network_mode: host` may not work. Use the Windows-specific compose file:

**Option 1: Use Windows-Specific Compose File**

```bash
docker-compose -f docker-compose.windows.yml up --build
```

This uses bridge networking instead of host mode. For physical device access, use tunnel mode:

```bash
docker-compose -f docker-compose.windows.yml exec expo-dev npx expo start --tunnel
```

**Option 2: Modify docker-compose.yml**

Remove the `network_mode: host` line and use explicit port mapping (already configured).

**Option 3: Use Docker Desktop WSL2 Backend**

1. Open Docker Desktop Settings
2. Go to General → Use WSL 2 based engine
3. This enables better network support on Windows
4. May allow `network_mode: host` to work

## Troubleshooting

### Port Already in Use

**Error**: `Port 19000 is already allocated`

**Solution**:
```bash
# Find process using the port
netstat -ano | findstr :19000  # Windows
lsof -i :19000                 # Mac/Linux

# Stop the process or change ports in docker-compose.yml
```

### Container Won't Start

**Error**: Container exits immediately

**Solution**:
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Expo Go Can't Connect

**Error**: "Unable to connect to Expo"

**Solutions**:
1. **Check network**: Ensure device and computer on same Wi-Fi
2. **Use tunnel mode**: `docker-compose exec expo-dev npx expo start --tunnel`
3. **Check firewall**: Allow ports 19000-19002 through firewall
4. **Windows users**: Try bridge network mode instead of host mode

### Hot Reload Not Working

**Issue**: Code changes don't reflect in app

**Solution**:
- Ensure volume mounts are correct in `docker-compose.yml`
- Check that `node_modules` volume is separate
- Restart container: `docker-compose restart`

### Permission Errors

**Error**: Permission denied when installing packages

**Solution**:
```bash
# Rebuild with no cache
docker-compose build --no-cache
docker-compose up
```

### Slow Performance

**Issue**: Container is slow

**Solutions**:
- Use WSL2 backend on Windows (Docker Desktop Settings)
- Increase Docker Desktop memory allocation
- Exclude project directory from antivirus scanning

## Development Workflow

### Making Code Changes

1. Edit files in your local editor (outside container)
2. Changes are automatically synced via volume mounts
3. Expo Metro bundler detects changes and hot reloads
4. App updates automatically on device/emulator

### Installing New Packages

**Method 1: Inside Container**
```bash
docker-compose exec expo-dev npm install <package-name>
```

**Method 2: Local + Rebuild**
```bash
# On your local machine
npm install <package-name>

# Rebuild container
docker-compose up --build
```

### Viewing Logs

```bash
# All logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Specific service logs
docker-compose logs expo-dev
```

### Accessing Container Shell

```bash
# Execute command in container
docker-compose exec expo-dev <command>

# Interactive shell
docker-compose exec expo-dev sh
```

## Production Considerations

⚠️ **Important**: This Docker setup is for **development only**.

For production builds:
- Use **EAS Build** (Expo Application Services)
- Or build locally with `expo build:android`
- Production Dockerfiles would be different (not included here)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Expo Documentation](https://docs.expo.dev/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/remote/containers)

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review Docker logs: `docker-compose logs`
3. Verify Docker Desktop is running
4. Ensure ports are not blocked by firewall
5. Try rebuilding: `docker-compose up --build --force-recreate`

