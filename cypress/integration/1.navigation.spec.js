describe("Navigation", function() {
  beforeEach(() => {
    cy.visit("/");
  });

  afterEach(() => {
    cy.request("/debug/reset");
  });

  it("navigates to the root successfully", function() {
    cy.location("pathname").should("eq", "/");
  });

  it("navigates to the first article by clicking on the title", function() {
    cy.get("article > h2 > a")
      .first()
      .click();

    cy.location("pathname").should("eq", "/articles/3");
  });

  it("navigates to the create article page", function() {
    cy.get("a")
      .contains("Create Article")
      .click();

    cy.location("pathname").should("eq", "/articles/new");
  });

  it("navigates to the edit article page from the individual article page", function() {
    cy.get("article > h2 > a")
      .first()
      .click();

    cy.location("pathname").should("eq", "/articles/3");

    cy.get("a")
      .contains("Edit Article")
      .click();

    cy.location("pathname").should("eq", "/articles/3/edit");
  });

  it("navigates to the delete article page from the individual article page", function() {
    cy.get("article > h2 > a")
      .first()
      .click();

    cy.location("pathname").should("eq", "/articles/3");

    cy.get("a")
      .contains("Delete Article")
      .click();

    cy.location("pathname").should("eq", "/articles/3/delete");
  });

  it("redirects to the list of articles after creating a new one", function() {
    cy.get("a")
      .contains("Create Article")
      .click();

    cy.location("pathname").should("eq", "/articles/new");

    cy.get("form").within(() => {
      cy.get("input[name=title]").type("New Blog Article");
      cy.get("textarea[name=content]").type("New Blog Content.");
      cy.get("button").click();
    });

    cy.location("pathname").should("eq", "/");
  });

  it("redirects to the specific article after editing an existing one", function() {
    cy.get("article > h2 > a")
      .first()
      .click();

    cy.get("a")
      .contains("Edit Article")
      .click();

    cy.get("form").within(() => {
      cy.get("input[name=title]").type(" Edited.");
      cy.get("button").click();
    });

    cy.location("pathname").should("eq", "/articles/3");
  });

  it("redirects to the list of articles after deleting an existing one", function() {
    cy.get("article > h2 > a")
      .first()
      .click();

    cy.get("a")
      .contains("Delete Article")
      .click();

    cy.get("form").within(() => {
      cy.get("button").click();
    });

    cy.location("pathname").should("eq", "/");
  });
});
