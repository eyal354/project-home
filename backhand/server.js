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

const houseId = "House15"; // ID of the house for which the server manages data
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

//-------------------------------------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------------------------------------
// Endpoint for getting the temperature based on user preferences
app.get("/api/getHomePreferences", async (req, res) => {
  try {
    const snapshot = await approvedUsersRef.once("value");
    const approvedUsers = snapshot.val();

    // Collect preferences of users currently at home
    let preferences = {
      temperature: [],
      lightlevel: [],
    };

    for (const userId in approvedUsers) {
      if (approvedUsers[userId].isHome) {
        if (
          approvedUsers[userId].pref &&
          approvedUsers[userId].pref.temperature
        ) {
          preferences.temperature.push({
            priority: approvedUsers[userId].priority || 0,
            value: approvedUsers[userId].pref.temperature,
          });
        }
        if (
          approvedUsers[userId].pref &&
          approvedUsers[userId].pref.lightlevel
        ) {
          preferences.lightlevel.push({
            priority: approvedUsers[userId].priority || 0,
            value: approvedUsers[userId].pref.lightlevel,
          });
        }
      }
    }

    const calculatePreference = (preferences) => {
      if (preferences.length === 0) return null; // No users at home or no preferences set

      const highestPriority = Math.max(...preferences.map((p) => p.priority));
      const highestPriorityPrefs = preferences.filter(
        (p) => p.priority === highestPriority
      );
      return (
        highestPriorityPrefs.reduce((sum, p) => sum + p.value, 0) /
        highestPriorityPrefs.length
      );
    };

    const avgTemperature = calculatePreference(preferences.temperature);
    const avgLightLevel = calculatePreference(preferences.lightlevel);

    res.status(200).send({
      temperature: avgTemperature !== null ? avgTemperature : 23, // Default temperature
      lightlevel: avgLightLevel !== null ? avgLightLevel : 50, // Default light level
    });
  } catch (error) {
    console.error("Error in getHomePreferences:", error);
    res.status(500).send({ message: "Server error" });
  }
});
//---------------------------------------------------------------------------------------------------
// Endpoint for setting the living room temperature
app.post("/api/setLivingRoomTemperature", async (req, res) => {
  try {
    const { temperature } = req.body; // Received temperature value from the request

    if (temperature === undefined) {
      return res.status(400).send({ message: "Temperature value is missing" });
    }

    // Reference to the Living Room in the Firebase Realtime Database
    const livingRoomRef = admin
      .database()
      .ref(`Houses/${houseId}/Rooms/Living Room`);

    // Set the temperature value in the 'TempRoom' key
    await livingRoomRef.update({ TempRoom: temperature });

    console.log(`Living Room Temperature set to: ${temperature}`); // Logs the updated temperature
    res
      .status(200)
      .send({ message: "Living Room Temperature updated successfully" });
  } catch (error) {
    console.error("Error in setting Living Room Temperature:", error);
    res.status(500).send({ message: "Server error" });
  }
});
approvedUsersRef
  .once("value", (snapshot) => {
    // Log the snapshot to see what you're getting back
    console.log(snapshot.val());
  })
  .catch((error) => {
    // Log any errors that occur
    console.error("Firebase operation failed:", error);
  });
//---------------------------------------------------------------------------------------------------
app.post("/api/setLightLevel", async (req, res) => {
  try {
    // Extract room and lightLevel from the request body
    const { lightlevel } = req.body;

    if (lightlevel === undefined) {
      console.log("no light level");
      // Respond with an error if required fields are missing
      return res
        .status(400)
        .send({ message: "Missing room or lightLevel in request" });
    }

    // Reference to the specific room in the Firebase Realtime Database
    const roomRef = admin.database().ref(`Houses/${houseId}/Rooms/Living Room`);

    // Set the light level in the 'LightLevel' key for the room
    await roomRef.update({ LightLevelRoom: lightlevel });

    console.log(`Light level for Living Room set to: ${lightlevel}`);
    res.status(200).send({ message: "Light level updated successfully" });
  } catch (error) {
    console.error("Error in setting light level:", error);
    res.status(500).send({ message: "Server error" });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
