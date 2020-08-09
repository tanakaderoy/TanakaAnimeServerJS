const HomePageController = require("../controllers/home-page-controller")
const SearchController = require("../controllers/search-controller")
const EpisodesController = require("../controllers/show-detail-controller")
const  express = require ("express");
const router = express.Router();

//define routes
router.get("/home",HomePageController.getHomePageShows);

router.get("/search",SearchController.peformSearch)

router.get("/",EpisodesController.getShowEpisodes)

module.exports = {router}
