const axios = require("axios");
const { BASE_URL } = require("../constants");

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3"
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

module.exports = {
  instance: axios.create({
    baseURL: BASE_URL,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; WatchNixtoons2/0.1.0; +https://github.com/doko-desuka/plugin.video.watchnixtoons2)"
    }
  }),
  axios: axios,
  tmdb
};
