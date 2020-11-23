/* eslint-disable no-eq-null */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {
  constants: { BASE_URL },
  cleanupName,
  puppeteerOptions
} = require("../constants");
const { SearchResult } = require("../models/SearchResult");
const puppeteer = require("puppeteer");
const { Util } = require("../utils/util");
let cache = {};
const getSearchResults = async query => {
  console.log(query);
  if (!cache[query]) {
    try {
      const browser = await puppeteer.launch(puppeteerOptions);
      const page = await browser.newPage();

      page.goto(BASE_URL + `?q=${query}&sengine=4ani`);
      await page.waitForSelector("li.mainsource", { timeout: 2000 });
      let html = await page.content();
      await page.screenshot({ path: "screnshot.png" });

      let dom = new JSDOM(html);
      let document = dom.window.document;

      let results = Array.from(document.querySelectorAll("li.mainsource"));
      let shows = results.map(r => {
        let poster = Util.getSrc(r, "img.resultimg");
        let releaseYear = "";
        let subtitle = Util.getTextContent(r, "p.infotext"); //r.querySelector("div.ongoingtitle > h4  > small").textContent;
        let title = Util.getTextContent(r, "p.name");
        let link = cleanupName(title);
        return new SearchResult(poster, releaseYear, subtitle, title, link);
      });
      await browser.close();
      cache[query] = shows;
      return shows;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  return cache[query];
};

const peformSearch = async (req, res) => {
  let { query } = req.query;
  let searchResults = await getSearchResults(query);
  console.log(searchResults);
  res.json(searchResults);
};

module.exports = {
  peformSearch
};
