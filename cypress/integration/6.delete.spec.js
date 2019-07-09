describe("Delete Page", function() {
  beforeEach(() => {
    cy.visit("/articles/3/delete");
  });

  afterEach(() => {
    cy.request("/debug/reset");
  });

  function submit() {
    cy.get("button")
      .contains("Delete Law Blog Article")
      .click();
  }

  it("deletes the existing blog article", function() {
    submit();

    cy.get("h2")
      .contains("Lobbing Law Bombs")
      .should("not.exist");
  });
});
