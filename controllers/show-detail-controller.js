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
const Datastore = require("nedb");

const db = new Datastore("episode_database.db");

db.loadDatabase();

const getEpisodes = async url => {
  console.log(`Getting episodes for show: ${url} \n`);

  trackedUrl = url;
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
    let link = BASE_URL + ep.getAttribute("href");

    return new Episode(title, subtitle, link);
  });
  db.insert({ _id: url, episodes });
  return episodes;
};

const getTextContent = (doc, selector) => select(doc, selector).textContent;

const select = (doc, selector) => doc.querySelector(selector);

const getShowEpisodes = async (req, res) => {
  let { show } = req.query;
  db.findOne({ _id: show }, async (err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    }
    if (!doc) {
      let episodes = await Promise.all([getEpisodes(show)]);
      let allEpisodes = episodes[0];
      res.json(allEpisodes);
    } else {
        console.log(JSON.stringify(doc.episodes));
      res.json(doc.episodes);
    }
  });
};

module.exports = {
  getShowEpisodes
};
