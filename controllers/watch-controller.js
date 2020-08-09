const { Video } = require("../models/Video");
const { JSDOM } = require("jsdom");
const { BASE_URL } = require("../constants");
const puppeteer = require("puppeteer");
const cors = require("cors")({ origin: true });

var trackingUrl = "";
var cache = { };

const getVideoUrl = async url => {
  console.log(`Searching for ${url} in cache`);

  if (cache[url] === undefined) {
console.log('not in cache');    
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });
    const page = await browser.newPage();
    await page.goto("https://" + url.replace('"', ""));

    let html = await page.content();
    // console.log(html);

    //
    // await page.waitFor(60000)

    let dom = new JSDOM(html);
    let document = dom.window.document;

    
    let x = document.querySelector(
      "#videowrapper_gvideo > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source"
    );
    if (x === null) {

      x = document.querySelector(
        "#videowrapper_gstore > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source"
      );
      try {    
              await page.screenshot({ path: "screnshot.png" });

        if(document.querySelector("#videowrapper_gstore > div > div.plyr__controls > div.plyr__controls__item.plyr__time--duration.plyr__time").textContent === "00:00"){
          await page.click("[href*='#gounlimited']");
    
          dom = new JSDOM(await page.content());
          document = dom.window.document;
          // x = document.querySelector("div#videowrapper_gounlimited > iframe");
          let gounl = BASE_URL+document.querySelector("div#videowrapper_gounlimited > iframe").src;
          await page.goto(gounl)
          await page.waitFor(100)
          dom = new JSDOM(await page.content());
          document = dom.window.document;
          x = document.querySelector("#vjsplayer_html5_api")
        }
      } catch (error) {
        console.error(error);
      }
      
    
    }
    if (x === null || x === undefined) {
      await page.click("[href*='#gounlimited']");

      dom = new JSDOM(await page.content());
      document = dom.window.document;
      // x = document.querySelector("div#videowrapper_gounlimited > iframe");
      let gounl = BASE_URL+document.querySelector("div#videowrapper_gounlimited > iframe").src;
      await page.goto(gounl)
      await page.waitFor(100)
      dom = new JSDOM(await page.content());
      document = dom.window.document;
      x = document.querySelector("#vjsplayer_html5_api")
      await page.screenshot({ path: "screnshot.png" });
    }
   
    let videoURL = x.getAttribute("src"); //document.querySelector("body > div.ui-page.ui-page-theme-a.ui-page-active > div.main.ui-content > div:nth-child(3) > div > div > iframe").attributes.getNamedItem("src").textContent
    console.log(videoURL);
    console.log("========================================");
    console.log(BASE_URL + videoURL);

    // await page.screenshot({path: 'screnshot.png'});
    await browser.close();
    let vid =  new Video(BASE_URL + videoURL);
    vid.src = vid.src.replace('https://animedao.comhttps://','https://')
    cache[url] = vid
    return cache[url];
  }
  console.log(`found ${url} in cache ${JSON.stringify(cache[url])}`);

  return cache[url];
};

module.exports.getVideo = (req, res) => {
  res.set("Cache-Control", "public, max-age=300, s-maxage=600");
  cors(req, res, async () => {
    let url = req.body.episodeURL.replace("https://", "");
    console.log("getting episode: " + url);

    getVideoUrl(url)
      .then(x => {
        return res.json({ msg: "Success", video: x.src });
      })
      .catch(x => {
        res.status(400).json({ ers: "You got an error", error: x });
      });
  });
};
