# CRUD with Express

Slides, code and notes available at [https://github.com/jensen/crud-notes/]([https://github.com/jensen/crud-notes/).

## Objectives

- Resources
- CRUD
- Routes
- Requests
- Express

## Resources

Almost any noun works as a resource. Some examples of resources would include:

- Photo
- User
- Tweet
- Marker

We want to avoid terms that don't pluralize well. An example of this is with the noun "Person" which has the plural form "People". Ideally we only use terms that pluralize by adding an "s". User, customer and student are all better resource options.

The resource that we are going to focus on today is called the "Article". When we have determined the resources that we are going to be keeping track of we will also want to think about the data that describes each type of resource.

Any article resource can be described using the following properties:

- **id**: _unique_ identification for the resource
- **title**: a string containing the title of the article
- **content**: a string representing the content of the article
- **date**: a javascript date object

## CRUD

A static resource is not as interesting as one that can be updated and shared. We perform actions on resources to make web applications valuable. Originally these resources were scientific documents shared between research centres.

### **C**reate

The creation of a resource on the server. Posting a photo, replying to a comment and booking a meeting are all examples of resource creation operations. The resource is given a unique identifier at the time that it is created.

A resource can be a file added to the file system, a database record added to a table or any other element that can persist as state. The article that we are going to create will be added to an in memory JavaScript object.

### **R**ead (Index, Show)

We use the term **read** to describe operations where cause not change of state to the server. When we list all of the articles or view a specific article we call this a _read_ operation. When we view a specific article the article id needs to be provided when the request is made.

### **U**pdate (Edit)

Originally an update was considered to be the complete replacement of an existing resource. Today it is common to update a single property on a resource. We make a request to update a resource on our server. The data that we pass to the server can vary depending on the implementation in the route handlers.

We need to know the existing id to perform an edit.

### **D**estroy (Delete)

When we want to remove an existing resource we can identify it by the unique id property and request that the server removes it. In our case this would be removing the key and value from the JavaScript object.

## Designing Routes

A route is the combination of a METHOD and a PATH MATCHER combined with a behaviour. They can be declared using the methods available from the `express` library. We use the name of the resource to decide the path. The resource `article` is pluralized to `articles` for all routes.

```javascript
/* METHOD and PATH MATCHER */
/* GET /articles HTTP/1.1 */
app.get("/articles", (request, response) => {
  /* BEHAVIOUR packaged in a function */
});
```

## Choosing The Method

### Safe

A safe request causes no change of state to the server. When we retrieve a list of tweets or search for something we can consider these operations as being safe.

### Body Data

The POST and PUT methods can include body data when a request is made. When we use forms this data is encoded by the browser and sent in a **url encoded** format.

The first line is the "request line". The "headers" come next and then after a blank line the "body" data is provided.

```
POST /articles HTTP/1.1
Content-Length: 155
Content-Type: application/x-www-form-urlencoded

title=Lobbing+Law+Bombs&content=Lots+and+lots+of+law+bombs+lobbed.+Little+law+bombs+littered+the+lawn%2C+while+larger+law+bombs+launching+lobbed+law+bombs.
```

The encoding follows a pattern of `key=value&key2=value2&key3=value3`. There are `+` symbols instead of spaces and a lot of other special characters need to be encoded. The good news is that the data is encoded and decoded for us. An express server often uses the `body-parser` library to decode the _url encoded_ into a `request.body` object.

### Idempotent

An idempotent request can be made more than once but will only change the server state on the initial request. It is easier to learn about idempotence through examples of how it is applied to our use of HTTP methods.

### Method Chart

```
 METHOD   | SAFE | BODY  | IDEMPOTENT
-------------------------------------
 GET      |  ✔️  |  ❌* |    ✔️
 POST     |  ❌  |  ✔️  |    ❌
 PUT      |  ❌  |  ✔️  |  ️️ ️️️️️️ ✔️️
 DELETE   |  ❌  |  ❌* |    ✔️
```

\* The GET and DELETE methods can optionally have a body, but it isn't used often.

There are other methods, but they are not required for the basic web servers we are buildingt this week.

### Mapping CRUD to Methods

**C**REATE -- SAFE ❌, BODY ✔️, IDEMPOTENT ❌ -- **POST**

Every single time this request is made, it will change the state of the server by adding a new resource. It is not idempotent because we can make the exact same request multiple times and create a new resource for each operation.

We start with a state of 'A'. When we make a POST request to create an article we change the state of the server. The server now has the state 'B'. We can make the exact same POST request and it will result in another change of state which we will call 'C'.

```
POST /articles

A -> POST -> B -> POST -> C -> POST -> D
```

**R**EAD -- SAFE ✔️, BODY ❌, IDEMPOTENT ✔️ -- **GET**

This single operation has a lot of use cases. The thing they all have in common is that they are safe operations. Searching, indexing and viewing a specific resource are all examples of safe read operations. We don't need body, but it's optional. The key is that we use GET for safe operations.

We start with a state of 'A'. When we make a GET request there is not change of state so we maintain the state 'A'.

```
GET /articles
GET /articles/1
GET /articles?search=term
GET /articles/new

A -> GET -> A -> GET -> A -> GET -> A
```

**U**PDATE -- SAFE ❌, BODY ✔️, IDEMPOTENT ✔️ -- **PUT**

We normally use an update when we are replacing an entire resource or certain properties on that resource. We need to know the id of the resource we are performing the update on. It is not safe because the state on the server changes. We use the body of the request to pass the updated data. It is important to note that an UPDATE is idempotent.

We start with the serer state 'A'. We make a request to update a resource, in this case the title of an article. We now have a new state of 'B' where the article is renamed. If we make that same request then it will not change the state again. The title being updated causes no change to the state.

```
PUT /articles/1

A -> PUT -> B -> PUT -> B -> PUT -> B
```

**D**ESTROY --SAFE ❌, BODY ❌, IDEMPOTENT ✔️ -- **DELETE**

Removing something is pretty familiar. It is not safe, and no body data is needed. It is idempotent, because we start with the resource and then we delete it. If we try and delete it again then we are in the same state with no resource. This is idempotent.

```
DELETE /articles/1

A -> DELETE -> B -> DELETE -> B -> DELETE -> B
```

## Requests From the Web Browser

There are a lot of ways that we can make requests from within the browser.

- Enter a URL into the location bar. GET.
- Refresh the page. GET.
- Click on a link. GET.
- Submit a form. GET or POST.
- Load external resource eg. img, script, link (stylesheet). GET.
- JavaScript XHR can do GET, POST, PUT and DELETE.

Today we will be focusing on making GET and POST requests using forms. Next week we will be using JavaScript to make HTTP requests using XMLHttpRequest (AJAX).

## Development Tools

As we work through the project we will use the developer tools exensively to inspect the HTTP messages being passed and forth.

## Testing with Cypress

Cypress is a tool that can be used to write automated tests for web applications. We use it to keep track of the requirements of the app. We can make sure that all of the features are implemented as long as we have a well defined set of tests.

## Middleware

### express.static()

We want to serve our css, scripts and images without creating custom routes for them. The [exress.static()](https://expressjs.com/en/starter/static-files.html) middleware helps us with this. Imagine that the `express.static("public")` function returns a new function that looks like this:

```javascript
function (request, response, next) {
  /*
    Get the file path from `request.url`.

    Search the "public" directory for a file with this path and name.

    If a file is found then `response.sendFile();`
    If a file is not found then `next()`
  */
}
```

The `next()` function is available in any express handler and can be used to advance to the next handler without finishing the response. In our example above the response finishes if the file is found.

### Custom

These custom middleware functions provide a common way to retrieve all of the articles or a specific article. In the case that the specific article doesn't exist we can handle the error in a consistent way.

```javascript
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
```

When we call `next(new Error())` then we are instructing express to continue and pass the error to the error handling middleware.

The [response.locals](https://expressjs.com/en/api.html#res.locals) object is useful for reducing the amount of code needed in our handlers. In the example above we are adding an article or articles object to the response that can be accessed by handlers later in the chain. The final template being rendered also has access to the `response.locals` object.

### Error Handling

We define the error handling middleware at the end of our list of handlers. It can handle the response with the error data instead of having to handle it for each route.

This error handler will make sure the error is an error with a status code. If it is it will render the error view witht he message. If not then it will report a general server error. Probably not a good idea to do this in production, but this is fine for development.

```javascript
app.use((error, request, response, next) => {
  if (error && error.statusCode) {
    response
      .status(error.statusCode())
      .render("error", { error: error.message() });
  } else {
    response.status(500).send("Server Error: " + error);
  }
});
```

## Forms

Forms allow us to GET or POST, but we are only going to use them for the POST operation. We will use a form to CREATE a new article. A form will be used to UPDATE an existing article and then a form with only a button in it will be used to DELETE.

```html
<form action="/articles" method="POST">
  <input type="text" placeholder="Title" name="title" required />
  <textarea placeholder="Content" name="content" required></textarea>
  <button>Submit Law Blog Article</button>
</form>
```

The important parts of the form.

- The form has an `action` and a `method` that match nicely with `/articles` and `POST`.
- The input and textarea have `name` attributes that will be used to track the values of the fields.
- The `required` attribute will enable in browser validation for these fields.
- Clicking a button inside of a form will cause the form to be submitted.

## Bonus

If using PUT and DELETE in express is important to you, then you
can use the [method-override](https://github.com/expressjs/method-override)
library to get around the limitation of the browser. We can only GET or POST
with a form. Method override means that we pass data on the body of the POST
request that informs the server that we are doing a PUT or DELETE request. This
lets the server convert it from a POST to a PUT or a DELETE before the routes
handle it.
