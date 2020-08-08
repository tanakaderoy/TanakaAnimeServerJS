const HomePageController = require("../controllers/home-page-controller")
const  express = require ("express");
const router = express.Router();

//define routes
router.get("/home",HomePageController.getHomePageShows);

module.exports = {router}
