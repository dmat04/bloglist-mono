describe('Blog app', () => {
  const user1 = {
    username: 'dmat',
    name: 'Matej Djerdji',
    password: 'tejma',
  }

  const user2 = {
    username: 'otherMat',
    name: 'Other Djerdji',
    password: 'tejma',
  }

  // const initialBlog = {
  //   title: 'Initial E2E testing blog entry',
  //   author: 'Some Author Jr.',
  //   url: 'www.fancyblogpost.com/dothis',
  // }

  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/test/reset`)
    cy.createUser(user1)
    cy.createUser(user2)
    cy.visit('')
  })

  it('Login form is shown', () => {
    cy.get('.login-form').as('loginForm')
    cy.get('@loginForm').get('#username-input')
    cy.get('@loginForm').get('#password-input')
    cy.get('@loginForm').get('#login-button')
  })

  // describe("Login", function () {
  //   it("succeeds with correct credentials", function () {
  //     cy.get(".login-form").as("loginForm");
  //     cy.get("@loginForm").get("#username-input").type(user1.username);
  //     cy.get("@loginForm").get("#password-input").type(user1.password);
  //     cy.get("@loginForm").get("#login-button").click();

  //     // cy.get(".notification")
  //     //   .should("contain", "Login successfull")
  //     //   .and("have.css", "color", "rgb(32, 178, 170)")
  //     //   .and("have.css", "border-style", "solid");

  //     cy.get("html").should("contain", `${user1.name} is logged in`);
  //   });

  //   it("fails with wrong credentials", function () {
  //     cy.get(".login-form").as("loginForm");
  //     cy.get("@loginForm").find("#username-input").type(user1.username);
  //     cy.get("@loginForm")
  //       .find("#password-input")
  //       .type(user1.password + user1.password);
  //     cy.get("@loginForm").find("#login-button").click();

  //     cy.get(".error")
  //       .should("contain", "Wrong credentials")
  //       .and("have.css", "color", "rgb(255, 69, 0)")
  //       .and("have.css", "border-style", "solid");

  //     cy.get("html").should("not.contain", `${user1.name} is logged in`);
  //   });
  // });

  // describe("When logged in", function () {
  //   beforeEach(function () {
  //     cy.loginUser(user1);
  //     cy.postBlog(initialBlog);
  //   });

  //   it("A blog can be created", function () {
  //     const data = {
  //       title: "A new blog title added by cypres",
  //       author: "Cypress Runner",
  //       url: "wwww.someurl.com/blogpost",
  //     };

  //     cy.contains("New blog").click();
  //     cy.get(".blogFormRoot").as("blogForm");
  //     cy.get("@blogForm").find(".inputTitle").type(data.title);
  //     cy.get("@blogForm").find(".inputAuthor").type(data.author);
  //     cy.get("@blogForm").find(".inputUrl").type(data.url);
  //     cy.get("@blogForm").find(".btnSubmit").click();

  //     cy.get(".notification")
  //       .should("contain", data.title)
  //       .and("contain", data.author)
  //       .and("have.css", "color", "rgb(32, 178, 170)");

  //     cy.get(".blogRoot").should("contain", data.title);
  //   });

  //   it("The user can like a blog", function () {
  //     cy.contains(initialBlog.title).as("blogToLike");
  //     cy.get("@blogToLike").find(".btnDetails").click();

  //     cy.get("@blogToLike")
  //       .find(".numLikes")
  //       .then((element) => {
  //         const likesBefore = parseInt(element.text());

  //         cy.get("@blogToLike").find(".btnLike").click();

  //         cy.get("@blogToLike")
  //           .find(".numLikes")
  //           .should("contain", likesBefore + 1);
  //       });
  //   });

  //   it("The user who created a blog can delete it", function () {
  //     cy.contains(initialBlog.title).as("blogToDelete");
  //     cy.get("@blogToDelete").find(".btnDetails").click();
  //     cy.get("@blogToDelete").find(".btnRemove").click();

  //     cy.get("blogToDelete").should('not.exist')
  //   });

  //   it("Only the use who created a blog can see its delete button, not anyone else", function () {
  //     cy.contains(initialBlog.title).as("blogToDelete");
  //     cy.get("@blogToDelete").find(".btnDetails").click();
  //     cy.get("@blogToDelete").find(".btnRemove");

  //     cy.get("#button-logout").click();
  //     cy.loginUser(user2);

  //     cy.contains(initialBlog.title).as("blogToDelete");
  //     cy.get("@blogToDelete").find(".btnDetails").click();
  //     cy.get("@blogToDelete").find(".btnRemove").should("not.exist");
  //   });
  // });

  // describe("When there are multiple blogs", function () {
  //   const blogs = [
  //     {
  //       title: "Blog title A",
  //       author: "Author A",
  //       url: "www.someurl.com/blogs/a",
  //     },
  //     {
  //       title: "Blog title B",
  //       author: "Author B",
  //       url: "www.someurl.com/blogs/b",
  //     },
  //     {
  //       title: "Blog title C",
  //       author: "Author C",
  //       url: "www.someurl.com/blogs/c",
  //     },
  //     {
  //       title: "Blog title D",
  //       author: "Author D",
  //       url: "www.someurl.com/blogs/d",
  //     },
  //     {
  //       title: "Blog title E",
  //       author: "Author E",
  //       url: "www.someurl.com/blogs/e",
  //     },
  //   ];

  //   beforeEach(function () {
  //     cy.loginUser(user1);
  //     blogs.forEach((b) => {
  //       cy.postBlog(b);
  //     });
  //   });

  //   it("the blogs are displayed in order of highest to lowest likes", function () {
  //     cy.get(".blogRoot").each(($blog, i) => {
  //       cy.wrap($blog).find(".btnDetails").click();

  //       for (let likes = 0; likes <= i; likes++) {
  //         cy.wrap($blog).find(".btnLike").click();
  //         cy.wrap($blog)
  //           .find(".numLikes")
  //           .should("contain", likes + 1);
  //       }
  //     });

  //     cy.get(".blogRoot").each(($blog, i, $list) => {
  //       if (i === $list.length - 1) {
  //         return false;
  //       }

  //       const currentLikes = parseInt($blog.find(".numLikes").first().text());
  //       cy.log("Current likes", currentLikes);
  //       cy.wrap($list)
  //         .eq(i + 1)
  //         .find(".numLikes")
  //         .invoke("text")
  //         .then(parseInt)
  //         .and("be.at.most", currentLikes);
  //     });
  //   });
  // });
})
