const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with Application Default Credentials
// This will use the credentials from your Firebase CLI login
admin.initializeApp({
  projectId: 'nhbea-64cab'
});

const db = admin.firestore();

async function importConferenceData() {
  try {
    // Read the JSON file
    const dataPath = path.join(__dirname, 'conference-2025-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const jsonData = JSON.parse(rawData);

    // Extract the conference data
    const conferenceData = jsonData.conference['conference-2025'];

    // Convert date strings to Firestore Timestamps
    const convertDates = (obj) => {
      const converted = { ...obj };

      // Convert schedule dates
      if (converted.schedule?.date) {
        converted.schedule.date = admin.firestore.Timestamp.fromDate(new Date(converted.schedule.date));
      }

      // Convert registration dates
      if (converted.registration?.openDate) {
        converted.registration.openDate = admin.firestore.Timestamp.fromDate(new Date(converted.registration.openDate));
      }
      if (converted.registration?.closeDate) {
        converted.registration.closeDate = admin.firestore.Timestamp.fromDate(new Date(converted.registration.closeDate));
      }
      if (converted.registration?.fees?.earlyBird?.deadline) {
        converted.registration.fees.earlyBird.deadline = admin.firestore.Timestamp.fromDate(
          new Date(converted.registration.fees.earlyBird.deadline)
        );
      }

      // Convert metadata dates
      if (converted.metadata?.createdAt) {
        converted.metadata.createdAt = admin.firestore.Timestamp.fromDate(new Date(converted.metadata.createdAt));
      }
      if (converted.metadata?.updatedAt) {
        converted.metadata.updatedAt = admin.firestore.Timestamp.fromDate(new Date(converted.metadata.updatedAt));
      }

      // Convert agenda session dates
      if (converted.agenda?.sessions) {
        converted.agenda.sessions = converted.agenda.sessions.map(session => ({
          ...session,
          startTime: admin.firestore.Timestamp.fromDate(new Date(session.startTime)),
          endTime: admin.firestore.Timestamp.fromDate(new Date(session.endTime))
        }));
      }

      return converted;
    };

    const dataToImport = convertDates(conferenceData);

    // Write to Firestore
    console.log('Importing conference data to Firestore...');
    await db.collection('conference').doc('conference-2025').set(dataToImport);

    console.log('✅ Successfully imported 2025 conference data!');
    console.log('   - Title:', dataToImport.title);
    console.log('   - Speakers:', dataToImport.speakers?.length || 0);
    console.log('   - Sessions:', dataToImport.agenda?.sessions?.length || 0);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing conference data:', error);
    process.exit(1);
  }
}

importConferenceData();
