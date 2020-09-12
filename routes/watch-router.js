const WatchController = require("../controllers/watch-controller")
const  express = require("express");
const router = express.Router();

//define routes
router.post("",WatchController.getVideo)

// router.all('/', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
//    });

module.exports = {router}
