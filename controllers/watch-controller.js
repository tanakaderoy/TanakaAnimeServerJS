const { Video } = require("../models/Video");
const { JSDOM } = require("jsdom");
const { Util } = require("../Utils/util");
const {
  constants: {
    BASE_URL,
    DATABASE_NAME,
    REGULAR_VIDEO_SELECTOR,
    GSTORE_SELECTOR
  }
} = require("../constants");
const puppeteer = require("puppeteer");
const cors = require("cors")({ origin: true });
const Datastore = require("nedb");

const db = new Datastore(DATABASE_NAME);

db.loadDatabase();

const getVideoUrl = async url => {
  try {
    console.log("not in cache");
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });
    const page = await browser.newPage();
    await page.goto("https://" + url.replace('"', ""));

    let html = await page.content();

    await page.screenshot({ path: "screnshot.png" });

    let dom = new JSDOM(html);
    let document = dom.window.document;

    let videoURL = Util.getSrc(
      document,
      "div.plyr__video-wrapper > video > source"
    );

    console.log(videoURL);
    console.log("========================================");
    console.log(BASE_URL + videoURL);

    // await page.screenshot({path: 'screnshot.png'});
    await browser.close();
    let vid = new Video(BASE_URL + videoURL);
    vid.src = vid.src.replace("https://animixplay.to/", "");
    db.insert({ src: vid.src, _id: url });
    return vid;
  } catch (error) {
    return error;
  }
};

module.exports.getVideo = (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  cors(req, res, async () => {
    console.log(req.body);
    let url = req.body.episodeURL.replace("https://", "");
    console.log("getting episode: " + url);
    console.time(`searching for: ${url}`);
    db.findOne({ _id: url }, (err, doc) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err });
      }
      if (!doc) {
        getVideoUrl(url)
          .then(video => {
            console.timeEnd(`searching for: ${url}`);
            console.log(video);
            return res.json({ msg: "Success", video: video.src });
          })
          .catch(x => {
            console.timeEnd(`searching for: ${url}`);
            res.status(400).json({ ers: "You got an error", error: x });
          });
      } else {
        console.timeEnd(`searching for: ${url}`);
        return res.json({ msg: "Success from cache", video: doc.src });
      }
    });
  });
};
