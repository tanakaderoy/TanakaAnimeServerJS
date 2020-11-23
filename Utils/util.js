class Util {
  static getHref(doc, selector) {
    return this.select(doc, selector).attributes.getNamedItem("href")
      .textContent;
  }

  static getTextContent(doc, selector) {
    return this.select(doc, selector).textContent;
  }

  static getTitle(doc, selector) {
    return this.select(doc, selector).title;
  }

  static getSrc(doc, selector) {
    return this.select(doc, selector).src;
  }
  static getDataSrcText(doc, selector) {
    return this.select(doc, selector).attributes.getNamedItem("data-src")
      .textContent;
  }

  static select(doc, selector) {
    return doc.querySelector(selector);
  }
}

module.exports = { Util };
