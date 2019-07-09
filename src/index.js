const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");

const formatDistanceToNow = require("date-fns/formatDistanceToNow");

const PORT = process.env.PORT || 3000;

const app = express();

const { Error404 } = require("./errors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

const database = require("./database")();

function getArticles(request, response, next) {
  response.locals.articles = database
    .getArticles()
    .sort((a, b) => b.date - a.date);
  next();
}

function getArticle(request, response, next) {
  const { id } = request.params;
  const article = database.articles[id];

  if (article === undefined) return next(new Error404());

  response.locals.article = article;
  next();
}

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((request, response, next) => {
  response.locals.formatDistanceToNow = formatDistanceToNow;

  next();
});

app.get("/", getArticles, (request, response) => {
  response.render("index");
});

app.get("/articles/new", (request, response) => {
  response.render("create");
});

app.get("/articles/:id", getArticle, (request, response) => {
  response.render("show");
});

app.post("/articles", (request, response) => {
  const article = {
    id: database.nextId++,
    title: request.body.title,
    content: request.body.content,
    date: new Date()
  };

  database.articles[article.id] = article;

  response.redirect("/");
});

app.get("/articles/:id/edit", getArticle, (request, response) => {
  response.render("edit");
});

app.post("/articles/:id/edit", getArticle, (request, response) => {
  const article = database.articles[request.params.id];

  article.title = request.body.title;
  article.content = request.body.content;

  response.redirect(`/articles/${request.params.id}`);
});

app.get("/articles/:id/delete", getArticle, (request, response) => {
  response.render("delete");
});

app.post("/articles/:id/delete", getArticle, (request, response) => {
  delete database.articles[request.params.id];

  response.redirect(`/`);
});

app.use("/debug/reset", (request, response) => {
  database.reset();
  response.status(204).send();
});

app.use((error, request, response, next) => {
  if (error && error.statusCode) {
    response
      .status(error.statusCode())
      .render("error", { error: error.message() });
  } else {
    response.status(500).send("Server Error: " + error);
  }
});

app.listen(3000, () => {
  console.log(`Listening on PORT ${PORT}.`);
});
