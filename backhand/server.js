const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./firebasesdk.json");

// Initialize Firebase Admin with Firebase configuration
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://react-site-a35a3-default-rtdb.europe-west1.firebasedatabase.app",
});

const app = express();
app.use(express.json()); // Support for JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // Support for URL-encoded bodies

const PORT = process.env.PORT || 3000;
let usersInHomeCount = 0; // Tracks the number of users currently at home

const houseId = "house1"; // ID of the house for which the server manages data
const approvedUsersRef = admin
  .database()
  .ref(`Houses/${houseId}/ApprovedUsers`);

// Updates the count of users at home
function updateUsersInHomeCount() {
  approvedUsersRef.once("value", (snapshot) => {
    const approvedUsers = snapshot.val() || {};
    usersInHomeCount = Object.values(approvedUsers).filter(
      (user) => user.isHome
    ).length;
    console.log(`Users in home: ${usersInHomeCount}`);
  });
}

// Listens for changes in ApprovedUsers to update the count
approvedUsersRef.on("child_changed", (snapshot) => {
  updateUsersInHomeCount();
});

// Initialize the user count when the server starts
updateUsersInHomeCount();

// RFID check endpoint
app.post("/api/rfidcheck", async (req, res) => {
  try {
    const { userRfid } = req.body; // Received RFID data from the request
    console.log(`Received RFID: ${userRfid}`); // Logs the received RFID data

    const snapshot = await approvedUsersRef.once("value");
    const approvedUsers = snapshot.val();
    let rfidExists = false;

    // Loop through each user to check if RFID matches
    for (const userId in approvedUsers) {
      if (approvedUsers[userId].RfidKey === userRfid) {
        rfidExists = true;
        const isCurrentlyHome = approvedUsers[userId].isHome;
        await approvedUsersRef
          .child(userId)
          .update({ isHome: !isCurrentlyHome });

        res
          .status(200)
          .send({ message: "RFID recognized", inHome: !isCurrentlyHome });
        return;
      }
    }

    if (!rfidExists) {
      res.status(404).send({ message: "RFID not found" });
    }
  } catch (error) {
    console.error("Error in RFID check:", error);
    res.status(500).send({ message: "Server error" });
  }
});

// Endpoint for getting the temperature based on user preferences
app.get("/api/getTemperature", async (req, res) => {
  try {
    const snapshot = await approvedUsersRef.once("value");
    const approvedUsers = snapshot.val();

    // Collect temperature preferences of users currently at home
    let usersAtHome = [];
    for (const userId in approvedUsers) {
      if (
        approvedUsers[userId].isHome &&
        approvedUsers[userId].pref &&
        approvedUsers[userId].pref.temperature
      ) {
        usersAtHome.push({
          priority: approvedUsers[userId].priority || 0,
          temperature: approvedUsers[userId].pref.temperature,
        });
      }
    }

    // If no users are at home, send default temperature
    if (usersAtHome.length === 0) {
      res.status(200).send({ temperature: 27 });
    } else {
      // Calculate the average temperature preference of users with highest priority
      const highestPriority = Math.max(
        ...usersAtHome.map((user) => user.priority)
      );
      const highestPriorityUsers = usersAtHome.filter(
        (user) => user.priority === highestPriority
      );
      const avgTemp =
        highestPriorityUsers.reduce((sum, user) => sum + user.temperature, 0) /
        highestPriorityUsers.length;
      res.status(200).send({ temperature: avgTemp });
    }
  } catch (error) {
    console.error("Error in getTemperature:", error);
    res.status(500).send({ message: "Server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
