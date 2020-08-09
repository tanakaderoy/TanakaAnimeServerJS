
/* eslint-disable no-eq-null */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { instance } = require("../api/axios");
const {
  BASE_URL,
  SHOW_DETAIL_EPISODES_SELECTOR,
  SHOW_DETAIL_SUBTITLE_SELECTOR
} = require("../constants");
const { Episode } = require("../models/Episode");

let showCache = { episodes: [] };
var counter = 0;
let trackedUrl = ""
const getEpisodes = async url => {
  console.log(`Getting episodes for show: ${url} \n`);
  counter++;
  if (counter > 100000) {
    showCache.episodes = [];
  }
  if (trackedUrl !== url) {
      trackedUrl = url
    const res = await instance.get(url);

    const html = res.data;
    // console.log(html);

    const dom = new JSDOM(html);
    const document = dom.window.document;
    let episodesArr = Array.from(
      document.querySelectorAll(SHOW_DETAIL_EPISODES_SELECTOR)
    );

    let episodes = episodesArr.map(ep => {
      let title = ep.getAttribute("title");
      let subtitle = getTextContent(ep, SHOW_DETAIL_SUBTITLE_SELECTOR);
      let link =BASE_URL+ep.getAttribute("href");

      return new Episode(title, subtitle, link);
    });
    showCache.episodes = episodes;
    return episodes;
  }
  return showCache.episodes;
};


const getTextContent = (doc, selector) => select(doc, selector).textContent;


const select = (doc, selector) => doc.querySelector(selector);
const getShowEpisodes = async (req, res) => {
let {show} = req.query
  let episodes = await Promise.all([getEpisodes(show)]);
  let allEpisodes = episodes[0];
  res.json(allEpisodes );
};

module.exports = {
  getShowEpisodes
};
