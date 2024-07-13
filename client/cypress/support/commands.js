// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("createUser", ({ username, name, password }) => {
  cy.request("POST", `${Cypress.env("BACKEND")}/users`, {
    username,
    name,
    password,
  });
});

Cypress.Commands.add("loginUser", ({ username, password }) => {
  cy.request("POST", `${Cypress.env("BACKEND")}/login`, {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("LOCAL_STORAGE_KEY_USER", JSON.stringify(body));
    cy.visit("");
  });
});

Cypress.Commands.add("postBlog", ({ title, author, url }) => {
  const token = JSON.parse(
    localStorage.getItem("LOCAL_STORAGE_KEY_USER"),
  ).token;

  cy.request({
    url: `${Cypress.env("BACKEND")}/blogs`,
    method: "POST",
    body: { title, author, url },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  cy.visit("");
});
