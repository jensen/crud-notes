describe("Error Handling", function() {
  afterEach(() => {
    cy.request("/debug/reset");
  });

  it("has a status code of 404 when article isn't found for show", function() {
    cy.request({
      url: "/articles/4",
      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.equal(404);
    });
  });

  it("has a status code of 404 when article isn't found for edit", function() {
    cy.request({
      url: "/articles/4/edit",
      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.equal(404);
    });
  });

  it("has a status code of 404 when article isn't found for delete", function() {
    cy.request({
      url: "/articles/4/delete",
      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.equal(404);
    });
  });

  it("shows the 404 error page", function() {
    cy.visit("/articles/4", {
      failOnStatusCode: false
    });

    cy.location("pathname").should("eq", "/articles/4");
  });

  it("shows a link back to the list of articles", function() {
    cy.visit("/articles/4", {
      failOnStatusCode: false
    });

    cy.get("a")
      .contains("Back To List")
      .click();

    cy.location("pathname").should("eq", "/");
  });
});
