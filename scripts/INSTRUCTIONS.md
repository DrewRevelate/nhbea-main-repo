# Add 2025 Conference Data to Firebase

## Quick Instructions

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/project/nhbea-64cab/firestore/databases/-default-/data/~2F
2. Make sure you're logged in as nhbeaorg@gmail.com

### Step 2: Navigate to Conference Collection
1. Click on the `conference` collection (or create it if it doesn't exist)
2. Click "Add Document" or the "+" button

### Step 3: Add the Document
1. **Document ID**: Enter `conference-2025`
2. Use the JSON data from `scripts/conference-2025-data.json`

### Step 4: Verify
1. Once added, go to https://www.nhbea.org/conference
2. You should see the 2025 conference information displayed

## Alternative: Use the Admin Panel

If you have an admin panel set up on your website:
1. Go to https://www.nhbea.org/admin
2. Navigate to the CMS or Conference Management section
3. Create a new conference entry with the 2025 data

## What the Data Includes

The 2025 conference data includes:
- **Basic Info**: 102nd Annual NHBEA Conference, October 24, 2025
- **Location**: Manchester Community College
- **8 Speakers**: Rony Camille (keynote), Stephen Lynn, Major Wheelock, Drew Lambert, Dean Graziano, Maria Matarazzo, James Dowding, Catherine Lambert
- **15 Sessions**: Including keynote, 4 workshops, 3 roundtables, and administrative sessions
- **Registration**: Opens August 1, 2025 | Capacity: 150 | Fees: $75 member, $100 non-member, $25 student
- **Schedule**: 8:00 AM - 2:00 PM with detailed timeline

## Need Help?

If you run into issues adding the data, you can:
1. Contact Firebase Support
2. Use the Firebase CLI with proper credentials
3. Manually enter each field in the Firebase Console
