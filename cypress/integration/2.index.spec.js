const articles = require("../../data/articles")();

describe("Index Page", function() {
  beforeEach(() => {
    cy.visit("/");
  });

  afterEach(() => {
    cy.request("/debug/reset");
  });

  it("has the title 'The Bob Loblaw Law Blog'", function() {
    cy.title().should("eq", "The Bob Loblaw Law Blog");

    cy.get("header > h1").should("contain", "The Bob Loblaw Law Blog");
  });

  it("has a create page link", function() {
    cy.get("a")
      .contains("Create Article")
      .should("exist");
  });

  it("lists the blog articles", function() {
    cy.get("article > h2").then($titles => {
      cy.wrap($titles).should("have.length", 3);
      Object.keys(articles).forEach(id => {
        cy.wrap($titles)
          .contains(articles[id].title)
          .should("exist");
      });
    });
  });

  it("lists the blog articles newest to oldest", function() {
    cy.get("article > h2")
      .first()
      .should("contain", "Lobbing Law Bombs");
  });
});
