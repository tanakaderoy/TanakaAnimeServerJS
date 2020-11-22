const { HomePageShow } = require("../models/HomePageShow");

const getHomePageShowsSample = () => {
  return [
    new HomePageShow(
      showNames.naruto,
      "https://image.tmdb.org/t/p/w1280/vauCEnR7CiyBDzRCeElKkCaXIYu.jpg",
      showNames.naruto,
      "currentEpURL",
      "currentEp"
    ),
    new HomePageShow(
      showNames.dragon,
      "https://image.tmdb.org/t/p/w1280/y1OdtgB2HhZqPwzcAldXZy7dymB.jpg",
      showNames.dragon,
      "currentEpURL",
      "currentEp"
    ),
    new HomePageShow(
      showNames.blackClover,
      "https://image.tmdb.org/t/p/w1280/kaMisKeOoTBPxPkbC3OW7Wgt6ON.jpg",
      showNames.blackClover,
      "currentEpURL",
      "currentEp"
    ),
    new HomePageShow(
      showNames.mob,
      "https://image.tmdb.org/t/p/w1280/5Wf9Y6gucbu1LMe1FyqD8TQjaNM.jpg",
      showNames.mob,
      "currentEpURL",
      "currentEp"
    ),
    new HomePageShow(
      showNames.onePunch,
      "https://image.tmdb.org/t/p/w1280/iE3s0lG5QVdEHOEZnoAxjmMtvne.jpg",
      showNames.onePunch,
      "currentEpURL",
      "currentEp"
    ),
    new HomePageShow(
      showNames.gintama,
      "https://image.tmdb.org/t/p/w1280/mWX2XnjYD8WxglIyTWM7z9FurXt.jpg",
      showNames.gintama,
      "currentEpURL",
      "currentEp"
    ),
    new HomePageShow(
      showNames.saiki,
      "https://image.tmdb.org/t/p/w1280/yjTBsKIc9rRQPqgVmrkSTz4hYg8.jpg",
      showNames.saiki,
      "currentEpURL",
      "currentEp"
    )
  ];
};

const showNames = {
  naruto: "Naruto",
  dragon: "Dragon Ball",
  blackClover: "Black Clover",
  mob: "Mob Psycho 100",
  onePunch: "One Punch Man",
  gintama: "Gintama",
  saiki: "Saiki Kusuo"
};

module.exports = { getHomePageShowsSample, showNames };
