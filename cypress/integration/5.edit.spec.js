describe("Edit Page", function() {
  beforeEach(() => {
    cy.visit("/articles/3/edit");
  });

  afterEach(() => {
    cy.request("/debug/reset");
  });

  function submit() {
    cy.get("button")
      .contains("Update Law Blog Article")
      .click();
  }

  it("edits existing blog article with title and content", function() {
    cy.get("input[name=title]").clear();
    cy.get("input[name=title]").type("Updated: Lobbing Law Bombs");
    cy.get("textarea[name=content]").type(" Not a real school.");

    submit();

    cy.get("h2")
      .contains("Updated: Lobbing Law Bombs")
      .should("exist");
  });
});
