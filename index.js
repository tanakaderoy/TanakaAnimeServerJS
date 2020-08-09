// const functions = require('firebase-functions');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")({ origin: true });
const showRoutes = require("./routes/route");
const watchRoute = require("./routes/watch-router");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 8004;

app.use("/shows", showRoutes.router);
app.use("/watch", watchRoute.router);

app.get("/timeStamp", (req, res) => {
  res.json({ date: `${Date.now()}` });
});

app.listen(port, () => {
  console.log(`HomePage Shows available http://localhost:${port}/shows/home`);
  console.log(`Watch an episode at http://localhost:${port}/shows/watch`);
  console.log(`Search For Shows at http://localhost:${port}/shows/search`);

  console.log("listenting to port: ", port);
});
