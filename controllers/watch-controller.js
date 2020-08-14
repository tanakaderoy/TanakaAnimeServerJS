const { Video } = require("../models/Video");
const { JSDOM } = require("jsdom");
const { BASE_URL, DATABASE_NAME } = require("../constants");
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


      let dom = new JSDOM(html);
      let document = dom.window.document;

      let x = document.querySelector(
        "#videowrapper_gvideo > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source"
      );
      console.log("x should go to Video \n", x);
      if (x === null || x === undefined) {
        x = document.querySelector(
          "#videowrapper_gstore > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source"
        );
      }

      if (x === null || x === undefined) {
        try {
          await page.click("[href*='#gounlimited']");

          dom = new JSDOM(await page.content());
          document = dom.window.document;
          // x = document.querySelector("div#videowrapper_gounlimited > iframe");
          let gounl =
            BASE_URL +
            document.querySelector("div#videowrapper_gounlimited > iframe").src;
          await page.goto(gounl);
          await page.waitFor(100);
          dom = new JSDOM(await page.content());
          document = dom.window.document;
          x = document.querySelector("#vjsplayer_html5_api");
          await page.screenshot({ path: "screnshot.png" });
        } catch (error) {
          console.error(error);
        }
      }
      console.log("x should go to Go \n", x);
      if (x === null || x === undefined) {
        x = document.querySelector(
          "#videowrapper_gstore > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source"
        );
        try {
          await page.screenshot({ path: "screnshot.png" });

          if (
            document.querySelector(
              "#videowrapper_gstore > div > div.plyr__controls > div.plyr__controls__item.plyr__time--duration.plyr__time"
            ) !== null ||
            document.querySelector(
              "#videowrapper_gstore > div > div.plyr__controls > div.plyr__controls__item.plyr__time--duration.plyr__time"
            ).textContent === "00:00"
          ) {
            await page.click("[href*='#gounlimited']");

            dom = new JSDOM(await page.content());
            document = dom.window.document;
            // x = document.querySelector("div#videowrapper_gounlimited > iframe");
            let gounl =
              BASE_URL +
              document.querySelector("div#videowrapper_gounlimited > iframe")
                .src;
            await page.goto(gounl);
            await page.waitFor(100);
            dom = new JSDOM(await page.content());
            document = dom.window.document;
            x = document.querySelector("#vjsplayer_html5_api");
          }
        } catch (error) {
          console.error(error);
          return error;
        }
      }

      let videoURL = x.getAttribute("src"); //document.querySelector("body > div.ui-page.ui-page-theme-a.ui-page-active > div.main.ui-content > div:nth-child(3) > div > div > iframe").attributes.getNamedItem("src").textContent
      console.log(videoURL);
      console.log("========================================");
      console.log(BASE_URL + videoURL);

      // await page.screenshot({path: 'screnshot.png'});
      await browser.close();
      let vid = new Video(BASE_URL + videoURL);
      vid.src = vid.src.replace("https://animedao.comhttps://", "https://");
      db.insert({ src: vid.src, _id: url });
      return vid;
  } catch (error) {
    return error;
  }
};

module.exports.getVideo = (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  cors(req, res, async () => {
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
