const {Video} = require("../models/Video");
const { JSDOM } = require("jsdom");
const { BASE_URL } = require("../constants");
const puppeteer = require("puppeteer");
const cors = require("cors")({ origin: true });

var trackingUrl = "";
var cache = { video: new Video("") };

const getVideoUrl = async (url) => {
    console.log(trackingUrl);
    
  if (trackingUrl !== url  || cache.video.src === "") {
    trackingUrl = url;
    const browser = await puppeteer.launch({  args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],headless: true});
    const page = await browser.newPage();
    await page.goto("https://" + url.replace('"', ""));


    let html = await page.content();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    //
    
    let x = document.querySelector(
      "#videowrapper_gstore > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source"
      );
      
      let videoURL = x.attributes.getNamedItem("src").textContent; //document.querySelector("body > div.ui-page.ui-page-theme-a.ui-page-active > div.main.ui-content > div:nth-child(3) > div > div > iframe").attributes.getNamedItem("src").textContent
      console.log(videoURL);
      console.log("========================================");
    console.log(BASE_URL + videoURL);

    // await page.screenshot({path: 'screnshot.png'});
    await browser.close();
    cache.video = new Video(BASE_URL + videoURL);
    return cache.video;
  }
  return cache.video;
};

module.exports.getVideo = (req,res) => {
  res.set('Cache-Control','public, max-age=300, s-maxage=600')
  cors(req, res, async () => {
    let url = req.body.episodeURL.replace("https://", "");
    console.log("getting episode: " + url);

    getVideoUrl(url)
      .then(x => {
        return res.json({ msg: "Success", video: x.src });
      })
      .catch(x => {
        res.status(400).json({ers:"You got an error", error: x });
      });
  });
};
