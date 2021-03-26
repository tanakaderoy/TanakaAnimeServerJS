const constants = {
  TVMAZE_BASE: "http://api.tvmaze.com/",
  TVMAZE: "http://api.tvmaze.com",
  TVMAZE_SHOW_SEARCH_ENDPOINT: "singlesearch/shows",
  LATEST_EPISODES_SELECTOR: "div.latestep_wrapper",
  IMG_SELECTOR: "div[class='col-xs-4 col-sm-2 latestep_image'] > a > img",
  SHOW_NAME_SELECTOR: "div[class='pull-left parent_container'] > a",
  SHOW_URL_SELEECTOR: "div[class='pull-left parent_container'] > a",
  CURRENT_EPISODE_URL_SELECTOR:
    "div[class='col-xs-4 col-sm-2 latestep_image'] > a",
  CURRENT_EPISODE_NAME_SELECTOR: "span.latestep_subtitle > b",
  BASE_URL: "https://animixplay.to/",
  SHOW_DETAIL_EPISODES_SELECTOR: "div.col-sm-6 > a.episode_well_link",
  SHOW_DETAIL_SUBTITLE_SELECTOR: "span.latestanime-subtitle",
  DATABASE_NAME: "watch_database.db",
  REGULAR_VIDEO_SELECTOR:
    "#videowrapper_gvideo > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source",
  GSTORE_SELECTOR:
    "#videowrapper_gstore > div > div.plyr__video-wrapper.plyr__video-wrapper--fixed-ratio > video > source",
};
const getShowSearchUrl = (query = "") => {
  return `${constants.TVMAZE_BASE}singlesearch/shows?q=${query}&embed=episodes`;
};
const getShowSearchEndpoint = (name = "") => {
  return `singlesearch/shows?q=${query}&embed=episodes`;
};
const cleanupName = (name = "") => {
  let newName = name.replace("TV", "");
  newName = newName.replace(/(\(\w*\)\s*)/g, "");
  newName = newName.replace(/(\dnd|\drd|\dth) Season/g, "");
  newName = newName.replace(/\(\d{0,4}\)/g, "");
  return newName;
};
const puppeteerOptions = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--single-process",
    "--no-zygote",
  ],
  headless: true,
};
const cleanupLink = (name = "") => {
  return name
    .replace(/\s+/g, "-")
    .replace(":", "")
    .replace(".","")
    .replace("-(TV)", "")
    .replace("-tv", "")
    .replace(/\!+/g, "")
    .replace(/\(|\)/g, "");
};

module.exports = {
  constants,
  getShowSearchUrl,
  getShowSearchEndpoint,
  cleanupName,
  cleanupLink,
  puppeteerOptions,
};
