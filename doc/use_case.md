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

1. Render a string: When user require the module directly, the user can render a
string literal template with data. The system will compile the string without
storing it to any cache, and apply the data directly to the template function.
This will directly return the string (pretty much like front-end)

    ``` js
    const EJS = require("ejs-alt");
    EJS.render("<p><%= num %></p>", { num: 3 }); // => "<p>3</p>"
    ```

    as described above compile and then call should also work in back-end

    ``` js
    var tmpl = EJS.compile("<p><%= num %></p>"); // => executable function
    tmpl({ num: 3 }); // => "<p>3</p>"
    ```

2. Render a file: In the back-end, the user should also be able to render a
file by specifying its path. The system will store the rendered template in the
cache and multiple render request will hence take less time:

    ``` js
    const EJS = require("ejs-alt");
    try {
        var html = EJS.renderFile("/index.html", { num: 3 });
    } catch (err) {
        console.error(err);
    }
    ```
    
    or in an async manner:
    
    ``` js
    const EJS = require("ejs-alt");
    EJS.renderFile("/index.html", { num: 3 }, function (err, html) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(html);
    });
    ```

3. ExpressJs support:

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
