describe("Show Page", function() {
  beforeEach(() => {
    cy.visit("/articles/3");
  });

  afterEach(() => {
    cy.request("/debug/reset");
  });

  it("has an edit article link", function() {
    cy.get("a")
      .contains("Edit Article")
      .should("exist");
  });

  it("has delete article link", function() {
    cy.get("a")
      .contains("Delete Article")
      .should("exist");
  });

  it("shows the title", function() {
    cy.get("h2")
      .contains("Lobbing Law Bombs")
      .should("exist");
  });

  it("shows the content", function() {
    cy.get("p")
      .contains(
        "Let Bob Loblaw show you how you too can lob law bombs. The Bob Loblaw Law Bomb Lobbing School of Law."
      )
      .should("exist");
  });

  it("shows the date", function() {
    cy.get("h3")
      .contains("less than a minute ago")
      .should("exist");
  });
});
