# Update Existing 2025 Conference with Program Details

Your 2025 conference is already in Firebase! We just need to add the detailed speaker and agenda information.

## What's Already There ✅
- Basic conference info
- Date: October 24, 2025
- Location: Manchester Community College
- Registration fees
- Status: Published and Active

## What Needs to Be Added ⚠️
- **Speakers Array** - 8 speakers with bios
- **Detailed Agenda** - 15 sessions with times and rooms
- **Session Learning Objectives**
- **Theme Colors**

## How to Update via Firebase Console

### Step 1: Open Your Conference Document
1. Go to: https://console.firebase.google.com/project/nhbea-64cab/firestore/databases/-default-/data/~2Fconference
2. Find and click on your existing 2025 conference document

### Step 2: Add Speakers Field
Click "Add Field" and add:
- **Field name**: `speakers`
- **Field type**: array
- **Add each speaker as a map** with these fields:
  ```json
  {
    "id": "rony-camille",
    "name": "Rony Camille",
    "title": "Media Manager",
    "organization": "Town of Tyngsboro, MA",
    "bio": "A communications and public affairs executive with 20+ years...",
    "websiteURL": "https://www.ronycamille.com/",
    "expertise": ["Communication", "Digital Media"],
    "sessionIds": ["keynote-1"],
    "isKeynote": true,
    "featured": true
  }
  ```

### Step 3: Add Agenda Field
Click "Add Field" and add:
- **Field name**: `agenda`
- **Field type**: map
- Add subfields:
  - `sessions` (array)
  - `tracks` (array): ["General", "Workshop Track A", "Workshop Track B", "Roundtable"]
  - `timeSlots` (array): ["8:00 AM", "9:00 AM", "10:00 AM", etc.]

### Step 4: Verify on Website
Go to https://www.nhbea.org/conference and check that:
- All speakers appear
- Full schedule displays
- Registration works

## Quick Copy-Paste Data

See the file `scripts/conference-2025-data.json` for the complete data structure you can reference.

### All 8 Speakers to Add:
1. **Rony Camille** (Keynote) - Media Manager, Town of Tyngsboro
2. **Stephen Lynn** - VP Fidelity Investments (Financial Literacy)
3. **Major Wheelock** - ECHS Coordinator (Early College)
4. **Drew Lambert** - Revelate Operations (Marketing & AI)
5. **Dean Graziano, J.D.** - VP Corporate Work-Study
6. **Maria Matarazzo** - UMass Lowell Professor (Roundtable)
7. **James Dowding** - Nashua HS North (Roundtable)
8. **Catherine Lambert** - Therosa Counseling (Roundtable)

### All 15 Sessions to Add:
- 8:00-8:30 AM: Registration
- 8:45 AM: Welcome (Colleen Jennings)
- 8:50 AM: Prayer & Pledge
- 8:55 AM: Keynote Introduction
- 9:00-9:45 AM: **Keynote** - Rony Camille
- 10:00-11:00 AM: **Workshop 1** - Stephen Lynn (Room 272) & **Workshop 2** - Major Wheelock (Room 274)
- 11:00-12:00 PM: **Workshop 3** - Drew Lambert (Room 272) & **Workshop 4** - Dean Graziano (Room 274)
- 12:00-1:00 PM: **Roundtables** - Maria, James, Catherine (Meeting Room)
- 1:00-1:30 PM: Lunch
- 1:30 PM: Annual Meeting
- 1:35 PM: Elections
- 1:45 PM: Awards
- 1:55 PM: Closing

## Need Help?

If manually adding this data is too tedious, I can:
1. Create a Firebase Function to update it
2. Use the Firebase CLI with proper auth
3. Build an admin interface to manage conference data

The conference page at `/conference/` is working - it just needs the detailed speaker and session data!
