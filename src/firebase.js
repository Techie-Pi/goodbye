require("dotenv").config();
const admin = require("firebase-admin");

const serviceAccount = require("../credentials/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIRESTORE_URL
})

module.exports = { firestore: admin.firestore() }
