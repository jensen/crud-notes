const articles = require("../data/articles");

module.exports = function createDatabase() {
  return {
    nextId: 4,
    articles: { ...articles() },
    getArticles() {
      return Object.keys(this.articles)
        .map(id => this.articles[id])
        .sort((a, b) => b.date - a.date);
    },
    reset() {
      this.articles = { ...articles() };
      this.nextId = 4;
    }
  };
};
