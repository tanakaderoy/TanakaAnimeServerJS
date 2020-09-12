/* eslint-disable no-eq-null */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {HomePageShow} = require("../models/HomePageShow");
const { instance } = require("../api/axios");
const {
  LATEST_EPISODES_SELECTOR,
  IMG_SELECTOR,
  SHOW_NAME_SELECTOR,
  BASE_URL,
  SHOW_URL_SELEECTOR,
  CURRENT_EPISODE_URL_SELECTOR,
  CURRENT_EPISODE_NAME_SELECTOR
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
    const res = await instance.get(url);

    const html = res.data;
    // console.log(html);

    const dom = new JSDOM(html);
    const document = dom.window.document;
    let showsArr = Array.from(
      document.querySelectorAll(LATEST_EPISODES_SELECTOR)
    );
    // showsArr.length = 9;
    let shows = showsArr.map(show => {
      let img = BASE_URL + getDataSrcText(show, IMG_SELECTOR);
      let showURL = BASE_URL + getHref(show, SHOW_URL_SELEECTOR);
      let name = getTitle(show, SHOW_NAME_SELECTOR).trim();
      let currentEpUrl = BASE_URL + getHref(show, CURRENT_EPISODE_URL_SELECTOR);
      let currentEp =
        getTextContent(show, CURRENT_EPISODE_NAME_SELECTOR)
          .trim()
          .replace(/(\r\n|\n|\r)/gm, "")
          .match(/\(([^)]+)\)/) !== null
          ? getTextContent(show, CURRENT_EPISODE_NAME_SELECTOR)
              .trim()
              .replace(/(\r\n|\n|\r)/gm, "")
              .match(/\(([^)]+)\)/)[1]
              .trim()
          : getTextContent(show, CURRENT_EPISODE_NAME_SELECTOR)
              .trim()
              .replace(/(\r\n|\n|\r)/gm, "");
      return new HomePageShow(name, img, showURL, currentEpUrl, currentEp);
    });
    showCache.shows = shows;
    return shows;
  }
  return showCache.shows;
};

const getHref = (doc, selector) =>
  select(doc, selector).attributes.getNamedItem("href").textContent;

const getTextContent = (doc, selector) =>
  select(doc, selector).textContent;

const getTitle = (doc, selector) =>
  select(doc,selector).title;

const getSrcText = (doc, selector) =>
  select(doc, selector).attributes.getNamedItem("src").textContent;
const getDataSrcText = (doc, selector) =>
  select(doc, selector).attributes.getNamedItem("data-src").textContent;

const select = (doc, selector) =>
  doc.querySelector(selector);
  const getHomePageShows = async (req, res) => {
    let shows = await Promise.all([getTrending(BASE_URL)]);
    let latestShows = shows[0];
    let topShow = latestShows[0]
    console.log(topShow)
    res.json({ latestShows });
  };
  
  module.exports = {
  getHomePageShows
  }