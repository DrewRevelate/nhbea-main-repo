# NHBEA Deployment Guide

## Project Structure (Cleaned)

```
📁 NHBEA-Source-Code/nhbea/
├─ .firebaserc              # Firebase project: nhbea-64cab
├─ firebase.json            # Hosting configuration
├─ 📁 out/                  # 171 deployment files (be764c)
├─ 📁 src/                  # Source code (for future builds)
├─ 📁 public/               # Static assets
├─ 📁 scripts/              # Build & utility scripts
├─ 📁 functions/            # Firebase Functions
├─ package.json             # Dependencies
└─ node_modules/            # Installed packages (803MB)
```

## Current Deployment Status

### Live Site
- **URL**: https://www.nhbea.org
- **Firebase URL**: https://nhbea-64cab.web.app
- **Version**: be764c (deployed Oct 7, 2025)
- **Files**: 171 files

### Preview Channel
- **URL**: https://nhbea-64cab--test-preview-82vbgoyp.web.app
- **Version**: be764c (deployed Oct 21, 2025)
- **Files**: 171 files
- **Expires**: November 4, 2025
- **Status**: ✅ Identical to live

## Deployment Commands

### Deploy to Preview Channel
```bash
cd "NHBEA-Source-Code/nhbea"
firebase hosting:channel:deploy test-preview
```

### Deploy to Live
```bash
cd "NHBEA-Source-Code/nhbea"
firebase deploy --only hosting
```

### List Channels
```bash
firebase hosting:channel:list
```

## What Was Cleaned

### Removed Files/Directories:
- ❌ `NHBEA-Restored-20251021/` - Duplicate deployment files
- ❌ `nhbea-64cab_55553df7fabe764c/` - Original be764c files (now in `out/`)
- ❌ `NHBEA/` - Old project directory
- ❌ `dataconnect/` - Unused data connector
- ❌ `src/` (root level) - Empty directory
- ❌ `.firebase/` - Deployment cache (regenerates)
- ❌ `.gemini/` - Gemini config
- ❌ `.next/` - Build cache (regenerates)
- ❌ `out-preview/` - Duplicate preview files
- ❌ Documentation files (RESTORATION-SUMMARY.md, etc.)
- ❌ Debug logs
- ❌ Beta Idea file
- ❌ Program.2025-1.docx

### What Remains:
- ✅ Deployment files (171 files in `out/`)
- ✅ Firebase configuration
- ✅ Source code (for future development)
- ✅ Firebase Functions
- ✅ Build scripts
- ✅ Dependencies

## Important Notes

1. **Current Deployment**: The `out/` directory contains the actual be764c files that are currently live on www.nhbea.org

2. **Source Code**: The source code in `src/` has been reconstructed with all routes, but some pages have placeholder content (bylaws, contact, etc.)

3. **To Deploy**: Simply run `firebase hosting:channel:deploy test-preview` or `firebase deploy --only hosting` - no build needed since `out/` already contains the deployment files

4. **To Rebuild from Source**: Run `npm run build` to generate new files in `out/` from the source code

5. **Project Size**: 803MB (mostly node_modules)

## Quick Reference

**Working Directory**:
```bash
cd "/Users/drewlambert/Library/Mobile Documents/com~apple~CloudDocs/Desktop/Desktop - MacBook Pro/Revelate/NHBEA/NHBEA-Source-Code/nhbea"
```

**Check Deployment Status**:
```bash
firebase hosting:channel:list
```

**Deploy Preview**:
```bash
firebase hosting:channel:deploy test-preview
```

**Deploy Live** (when ready):
```bash
firebase deploy --only hosting
```
