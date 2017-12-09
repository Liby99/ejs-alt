# EJS-ALT Use Cases

Here are a list of use cases I want to fulfill in EJS-ALT.

## Front-end

Import the library using `<script>` tag

``` html
<script src="js/ejs.js"></script>
```

Then render in js

``` js
EJS.render("<p><%= num %></p>", { num: 3 }); // => "<p>3</p>"
```

you can also use compile to generate intermediate template function

``` js
var tmpl = EJS.compile("<p><%= num %></p>"); // => executable function
tmpl({ num: 3 }); // => "<p>3</p>"
```

## Back-end

1. When user require the module directly, the user can render a string literal
template with data. The system will compile the string without storing it to
any cache, and apply the data directly to the template function. This will
directly return the string (pretty much like front-end)

``` js
const EJS = require("ejs-alt");
EJS.render("<p><%= num %></p>", { num: 3 }); // => "<p>3</p>"
```

as described above compile and then call should also work in back-end

``` js
var tmpl = EJS.compile("<p><%= num %></p>"); // => executable function
tmpl({ num: 3 }); // => "<p>3</p>"
```

2. ExpressJs support

Setting up:

``` js
app.set("views", "/public");
app.engine(".html", require("ejs-alt").__express);
app.set('view engine', "html");
```

When rendering a page:

``` js
app.get("/", function (req, res) {
    res.render("index.html", { num: 3 }, function (err, html) {
        if (err) {
            console.error(err);
            res.status(500).send("Error rendering index.html");
        }
        else {
            res.send(html);
        }
    });
});
```
