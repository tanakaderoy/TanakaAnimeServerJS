/* eslint-disable no-eq-null */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { HomePageShow } = require("../models/HomePageShow");
const { Util } = require("../Utils/util");
const { instance } = require("../api/axios");
const puppeteer = require("puppeteer");
const {
  constants: { BASE_URL },
  cleanupName,
  puppeteerOptions
} = require("../constants");
let showCache = { shows: [] };
var counter = 0;
const getTrending = async url => {
  console.log(`Scraping: ${url} \n`);
  counter++;
  if (counter > 100000) {
    showCache.shows = [];
  }
  if (showCache.shows.length <= 0) {
    try {
      const browser = await puppeteer.launch(puppeteerOptions);
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(90000);

      // await page.setViewport({ width, height });

      await page.setUserAgent("UA-TEST");
      page.goto(url, { waitUntil: "domcontentloaded" });
      await Promise.all([page.waitForNavigation()]);
      const loadMore = async () => {
        await page.evaluate(_ => {
          loadmoreseasonal();
          loadmoreseasonal();
          loadmoreseasonal();
          document.querySelector("div#loadmorelist").click();
        });
        await page.waitFor(100);
      };

      await Promise.all([loadMore(), loadMore(), loadMore()]);

      let html = await page.content();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      let showsArr = Array.from(
        document.querySelectorAll("ul.searchresult > li")
      );
      let shows = getHomePageShowArrFromHtmlEltArr(showsArr);
      showCache.shows = shows;
      return shows;
    } catch (error) {
      console.error(error);
      return await getHomePageShowsStaticHtml(url);
    }
  }
  return showCache.shows;
};

const getHomePageShowsStaticHtml = async url => {
  const res = await instance.get(url);
  const html = res.data;
  const dom = new JSDOM(html);
  const document = dom.window.document;
  let showsArr = Array.from(document.querySelectorAll("ul.searchresult > li"));
  let shows = getHomePageShowArrFromHtmlEltArr(showsArr);
  showCache.shows = shows;
  return shows;
};

const getHomePageShows = async (req, res) => {
  const latestShows = await getTrending(BASE_URL);
  res.json({ latestShows });
};

const getHomePageShowArrFromHtmlEltArr = showsArr => {
  return showsArr.map(ep => {
    let img = Util.getSrc(ep, "div.searchimg > a > img");
    let name = Util.getTitle(ep, "div.searchimg > a");
    let currentEpUrl =
      BASE_URL + Util.getHref(ep, "div.searchimg > a").replace("/v1/", "v4/4-");

    let currentEp = Util.getTextContent(ep, "p.infotext");
    return new HomePageShow(
      name,
      img,
      cleanupName(name),
      currentEpUrl,
      currentEp
    );
  });
};

module.exports = {
  getHomePageShows
};
