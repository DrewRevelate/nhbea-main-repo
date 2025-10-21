# NHBEA Website - Main Repository

Official repository for the **New Hampshire Business Education Association** (NHBEA) website.

## 🌐 Live Site

- **Production**: https://www.nhbea.org
- **Firebase**: https://nhbea-64cab.web.app
- **Preview**: https://nhbea-64cab--test-preview-82vbgoyp.web.app

## 📋 Overview

This repository contains the complete NHBEA website including:
- Next.js 15 application with TypeScript and React
- Firebase Hosting configuration
- Deployment-ready static files (171 files from be764c)
- Firebase Functions for backend API
- 39 pages including conference, awards, membership, and admin sections

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd nhbea-main-repo

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📦 Deployment

### Deploy to Preview Channel
```bash
firebase hosting:channel:deploy test-preview
```

### Deploy to Production
```bash
firebase deploy --only hosting
```

### Build from Source
```bash
npm run build
```

## 📁 Project Structure

```
nhbea-main-repo/
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities and data access
│   └── types/             # TypeScript types
├── out/                   # Deployment files (171 files)
├── public/                # Static assets
├── functions/             # Firebase Functions
├── scripts/               # Build and utility scripts
├── .env.local             # Environment variables (public Firebase config)
├── firebase.json          # Firebase Hosting configuration
├── .firebaserc            # Firebase project config
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to Firebase Hosting

## 🔑 Environment Variables

Firebase configuration is stored in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

*Note: All variables are prefixed with `NEXT_PUBLIC_` and are safe for public repositories.*

## 📄 Pages

### Public Pages
- `/` - Homepage
- `/about` - About NHBEA
- `/conference` - Annual conference information
- `/awards` - Awards and nominations
- `/hall-of-fame` - Honored educators
- `/membership/*` - Membership pages
- `/bylaws` - Organization bylaws
- `/contact` - Contact form

### Admin Pages (Protected)
- `/admin` - Admin dashboard
- `/admin/awards` - Awards management
- `/admin/conference` - Conference management
- `/admin/members` - Member management
- `/admin/users` - User management
- *...and more*

## 🔐 Firebase Services

- **Hosting**: Static site hosting
- **Firestore**: Database for members, awards, conference data
- **Authentication**: User authentication
- **Functions**: Backend API endpoints
- **Storage**: File uploads

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Functions, Auth)
- **Deployment**: Firebase Hosting
- **Build**: Static export

## 📊 Deployment Status

Current deployment version: **be764c**
- Deployed: October 7, 2025
- Files: 171 static files
- Status: ✅ Production ready

## 🤝 Contributing

This is a private repository for NHBEA. For access or questions, contact:
- Email: nhbeaorg@gmail.com
- Website: https://www.nhbea.org

## 📝 Documentation

Additional documentation:
- [DEPLOYMENT-README.md](./DEPLOYMENT-README.md) - Detailed deployment guide
- [Firebase Console](https://console.firebase.google.com/project/nhbea-64cab)

## 🔄 Git Workflow

Main branch: `main`
- All deployments come from `main`
- Production deployments require testing on preview channel first

## 📜 License

© 2025 New Hampshire Business Education Association. All rights reserved.

---

**Website by**: Drew Lambert ([DrewLambert.com](https://DrewLambert.com))

🤖 Repository initialized with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
