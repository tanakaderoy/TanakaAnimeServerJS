const { default: Axios } = require("axios");
const axios = require("axios");
const {
  constants: { BASE_URL, TVMAZE, TVMAZE_SHOW_SEARCH_ENDPOINT },
  getShowSearchEndpoint
} = require("../constants");

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3"
});

const tvmaze = Axios.create({
  baseURL: TVMAZE
});
tvmaze.interceptors.request.use(req => {
  console.log(`${req.method} ${req.url}`);
  // Important: request interceptors **must** return the request.
  return req;
});
tvmaze.interceptors.response.use(res => {
  console.log(res.data.name);
  // Important: response interceptors **must** return the response.
  return res;
});

tmdb.interceptors.request.use(req => {
  req.params["api_key"] = process.env.API_KEY;

  console.log(`${req.method} ${req.url}`);
  // Important: request interceptors **must** return the request.
  return req;
});

tmdb.interceptors.response.use(res => {
  console.log(res.data.results[0]);
  // Important: response interceptors **must** return the response.
  return res;
});

const getTVMAZEShowEpisodes = async (show = "") => {
  try {
    let res = await tvmaze.get(TVMAZE_SHOW_SEARCH_ENDPOINT, {
      params: { q: show, embed: "episodes" }
    });

    return res.data;
  } catch (error) {
    // console.error(error);
    return undefined;
  }
};

module.exports = {
  instance: axios.create({
    baseURL: BASE_URL,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; WatchNixtoons2/0.1.0; +https://github.com/doko-desuka/plugin.video.watchnixtoons2)"
    }
  }),
  axios: Axios,
  tvmaze,
  getTVMAZEShowEpisodes,
  tmdb
};
