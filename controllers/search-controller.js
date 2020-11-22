/* eslint-disable no-eq-null */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { HomePageShow } = require("../models/HomePageShow");
const { getHomePageShowsSample } = require("../utils/util");
const { instance, tmdb } = require("../api/axios");
const {
  LATEST_EPISODES_SELECTOR,
  IMG_SELECTOR,
  SHOW_NAME_SELECTOR,
  BASE_URL,
  SHOW_URL_SELEECTOR,
  CURRENT_EPISODE_URL_SELECTOR,
  CURRENT_EPISODE_NAME_SELECTOR
} = require("../constants");
const { SearchResult } = require("../models/SearchResult");

let showCache = {};
var counter = 0;
let trackedUel = "";

const getSearchResults = async query => {
  if (!showCache[query]) {
    const res = await instance.get(BASE_URL + "/search/?key=" + query);
    const html = res.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    let results = Array.from(
      document.querySelectorAll(
        "div [class='col-xs-6 col-sm-3 col-md-2 animelist_poster']"
      )
    );
    let shows = results.map(r => {
      let poster =
        BASE_URL +
        r.querySelector("div.thumbnail > a > img").getAttribute("data-src");
      // let releaseYear = r.querySelector("div [class='col-xs-8'] > span > b").textContent;
      let releaseYear = "";
      let subtitle = ""; //r.querySelector("div.ongoingtitle > h4  > small").textContent;
      let title = r.querySelector("div.animelist_poster_caption > center")
        .textContent;
      let link = BASE_URL + r.querySelector("a").getAttribute("href");
      return new SearchResult(poster, releaseYear, subtitle, title, link);
    });
    try {
      for (let show of shows) {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await tmdb.get("/search/tv", {
          params: {
            query: show.title.replace(" (Dubbed)", "")
          }
        });
        if (data.total_results >= 1) {
          let res = data.results.filter(res => {
            return res.name === show.title.replace(" (Dubbed)", "");
          });
          show.releaseYear = res[0].first_air_date;
          show.subtitle = res[0].original_name;
        }
      }
    } catch (error) {
      console.error(error);
    }

    showCache[query] = shows;
    return showCache[query];
  }
  return showCache[query];
};

const peformSearch = async (req, res) => {
  let { query } = req.query;
  // showCache.shows = query === trackedUel ? [] : showCache.shows
  // let shows = await Promise.all([getSearchResults(query)]);
  // let searchResults = shows[0];
  // console.log(searchResults);
  let searchResults = getHomePageShowsSample().map(x => {
    return new SearchResult(x.image, "2020", "a show", x.title, x.url);
  });
  res.json(searchResults);
};

module.exports = {
  peformSearch
};
