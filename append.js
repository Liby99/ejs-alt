const fs = require("fs");

var stack = [];
var readFile = (filename) => fs.readFileSync(__dirname + "/" + filename, "utf8")
var append = (str) => { stack[stack.length - 1] += str }
var run = (d) => d instanceof Function ? renderFunc(d)
    : d instanceof Array ? d.map((o) => run(o))
        : d instanceof Object ? Object.keys(d).reduce((p, c) => { p[c] = run(d[c]); return p; }, {})
            : d;
var renderFunc = (fn, data) => { stack.push(""); fn(data); return stack.pop(); }
var render = (name, data) => {
    if (!templates[name]) {
        templates[name] = compile(readFile(name));
    }
    renderFunc(templates[name], data)
}
var include = (name, data) => append(render(name, run(data)))
var escape = (html) => String(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');

var parse = (str) => {
    var res = "", ln = 0, len = str.length, open = "<%", close = "%>", normal = false;
    for (var i = 0; i < len; i++) {
        var c = str[i];
        if (str.slice(i, i + open.length) === open) {
            
            if (normal) {
                res += "\");";
                normal = false;
            }
            
            i += open.length;
            
            var pre, post;
            switch (str[i]) {
                case '=': pre = "append(escape("; post = "));"; i++; break;
                case '-': pre = "append("; post = ");"; i++; break;
                default: pre = ""; post = "";
            }
            
            var j = str.indexOf(close, i);
            
            if (j < 0) {
                throw new Error("Could not find matching close tag");
            }
            
            var js = str.substring(i, j);
            
            res += pre + js.trim() + post;
            i += j - i + close.length - 1;
        }
        else {
            
            if (!normal) {
                res += "append(\"";
                normal = true;
            }
            
            if (c == "\\") {
                res += "\\\\";
            }
            else if (c == "\"") {
                res += "\\\"";
            }
            else if (c == "\n") {
                res += "\\n";
            }
            else {
                res += c;
            }
        }
    }
    if (normal) {
        res += "\");";
        normal = false;
    }
    return res;
}

var compile = (html) => {
    return new Function("data", "with (data || {}) { " + parse(html) + " } ");
}

var templates = {
    // "a.html": (data) => {
    //     with (data || {}) {
    //         include("b.html", {
    //             content: () => {
    //                 append(num);
    //                 append("\n");
    //                 append("678\n");
    //             },
    //             num: num
    //         });
    //         append(str);
    //     }
    // },
    // "b.html": (data) => {
    //     with (data || {}) {
    //         append("012\n");
    //         append(content);
    //     }
    // }
}

// console.log(renderFunc(compile(html), { str: "901\n", num: 5 }));

// console.log(render(html, { str: "901\n", num: 5 }));

console.log(render("a.html", { str: "this is in a", id: "id"}))
