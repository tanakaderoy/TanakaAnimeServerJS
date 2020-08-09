const HomePageController = require("../controllers/home-page-controller")
const SearchController = require("../controllers/search-controller")
const  express = require ("express");
const router = express.Router();

//define routes
router.get("/home",HomePageController.getHomePageShows);

router.post("/search",SearchController.peformSearch)

module.exports = {router}
