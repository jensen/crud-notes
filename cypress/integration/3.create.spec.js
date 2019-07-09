describe("Create Page", function() {
  beforeEach(() => {
    cy.visit("/articles/new");
  });

  afterEach(() => {
    cy.request("/debug/reset");
  });

  function submit() {
    cy.get("button")
      .contains("Submit Law Blog Article")
      .click();
  }

  it("creates a new blog article with title and content", function() {
    cy.get("input[name=title]").type("New Blog Article");
    cy.get("textarea[name=content]").type("A lot of law content.");

    submit();

    cy.get("h2")
      .contains("New Blog Article")
      .should("exist");
  });

  it("shows a validation error when title or content are empty", function() {
    function valid($element) {
      return $element.get(0).validationMessage;
    }

    cy.get("input[name=title]").as("title");
    cy.get("textarea[name=content").as("content");

    submit();

    cy.get("@title").then($input => {
      expect(valid($input)).to.equal("Please fill out this field.");
    });

    cy.get("@title").type("Breaking: Law Bombs Lobbed");

    submit();

    cy.get("@content").then($input => {
      expect(valid($input)).to.equal("Please fill out this field.");
    });

    cy.get("@title").clear();
    cy.get("@content").type("Required by law to lob law bombs.");

    submit();

    cy.get("@title").then($input => {
      expect(valid($input)).to.equal("Please fill out this field.");
    });

    cy.get("@title").type("Breaking: Law Bombs Lobbed");

    submit();

    cy.get("h2")
      .contains("Breaking: Law Bombs Lobbed")
      .should("exist");
  });
});
