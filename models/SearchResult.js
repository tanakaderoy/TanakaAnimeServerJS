class SearchResult {
  constructor(poster, releaseYear, subtitle, title, link) {
    this.releaseYear = releaseYear;
    this.poster = poster;
    this.title = title;
    this.link = link;
    this.subtitle = subtitle;
  }
}
module.exports = {SearchResult}