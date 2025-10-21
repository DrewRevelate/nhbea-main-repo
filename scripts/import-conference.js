
const admin = require("firebase-admin");
const fs = require("fs");

admin.initializeApp({
  projectId: "nhbea-64cab"
});

const db = admin.firestore();
const data = JSON.parse(fs.readFileSync("./scripts/conference-2025-data.json", "utf8"));

async function importData() {
  try {
    const conferenceData = data.conference["conference-2025"];
    
    // Convert date strings to Firestore Timestamps
    conferenceData.schedule.date = admin.firestore.Timestamp.fromDate(new Date(conferenceData.schedule.date));
    conferenceData.registration.openDate = admin.firestore.Timestamp.fromDate(new Date(conferenceData.registration.openDate));
    conferenceData.registration.closeDate = admin.firestore.Timestamp.fromDate(new Date(conferenceData.registration.closeDate));
    conferenceData.registration.fees.earlyBird.deadline = admin.firestore.Timestamp.fromDate(new Date(conferenceData.registration.fees.earlyBird.deadline));
    conferenceData.metadata.createdAt = admin.firestore.Timestamp.fromDate(new Date(conferenceData.metadata.createdAt));
    conferenceData.metadata.updatedAt = admin.firestore.Timestamp.fromDate(new Date(conferenceData.metadata.updatedAt));
    
    // Convert all session times
    conferenceData.agenda.sessions.forEach(session => {
      session.startTime = admin.firestore.Timestamp.fromDate(new Date(session.startTime));
      session.endTime = admin.firestore.Timestamp.fromDate(new Date(session.endTime));
    });

    await db.collection("conference").doc("conference-2025").set(conferenceData);
    console.log("✅ 2025 Conference data imported successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
}

importData();

