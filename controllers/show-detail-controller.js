/* eslint-disable no-eq-null */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { getTVMAZEShowEpisodes } = require("../api/axios");
const {
  constants: { BASE_URL },
  cleanupLink
} = require("../constants");
const puppeteer = require("puppeteer");

const { Episode } = require("../models/Episode");

const getEpisodes = async name => {
  console.log(`Getting episodes for show: ${name} \n`);

  let json = await getTVMAZEShowEpisodes(name);
  if (json) {
    return getEpisodesFromJSON(json, name);
  } else {
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true
      });
      const page = await browser.newPage();
      await page.setUserAgent("UA-TEST");
      name = cleanupLink(name);
      console.log(`The name is: \n ${name}`);
      page.goto(`${BASE_URL}v4/4-${name}`, {
        waitUntil: "domcontentloaded"
      });
      await Promise.all([page.waitForNavigation()]);
      let html = await page.content();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      let epNo = parseInt(getTextContent(document, "span#epsavailable"));
      let eps = [];
      for (let i = 1; i <= epNo; i++) {
        let title = `Ep: ${i}`;
        let subtitle = `${i}`;
        name = name.replace(/\s+/g, "-");
        let link = `${BASE_URL}v4/4-${name}/ep${i}`;
        eps.push(new Episode(title, subtitle, link));
      }

      return eps;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
};

const getShowEpisodes = async (req, res) => {
  let { show } = req.query;
  let episodes = await Promise.all([getEpisodes(show)]);
  let allEpisodes = episodes[0];
  res.json(allEpisodes);
};

const getEpisodesFromJSON = (json, name) => {
  let episodesArr = json["_embedded"]["episodes"];

  let episodes = episodesArr.map(ep => {
    let title = ep["name"];
    let subtitle = `${ep["number"]}`;
    let link = `${BASE_URL}v4/4-${cleanupLink(name)}/ep${ep["number"]}`;

    return new Episode(title, subtitle, link);
  });
  return episodes;
};

module.exports = {
  getShowEpisodes
};
