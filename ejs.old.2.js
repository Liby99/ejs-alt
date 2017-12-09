const fs = require("fs");
const path = require("path");

var stack = [], templates = {};

const peekPath = () => stack.length ? stack[stack.length - 1].name : __dirname

const resolve = (filename) => path.join(path.dirname(peekPath()), filename);

const pushStack = () => { stack.push({ html: "", name: peekPath() })}

const popStack = () => stack.pop();

const readFile = (filename) => fs.readFileSync(filename, "utf8")

const append = (str) => { stack[stack.length - 1].html += str }

const run = (d) => d instanceof Function ? renderFunc(d) : d instanceof Array ? d.map((o) => run(o)) : d instanceof Object ? Object.keys(d).reduce((p, c) => { p[c] = run(d[c]); return p; }, {}) : d;

const renderFunc = (fn, data) => { pushStack(); fn(data); return popStack() }

const render = (name, data) => {
    var fullname = resolve(name);
    if (!templates[fullname]) {
        templates[fullname] = function (data) {
            compile(readFile(fullname))(data, include, append, escape);
        }
    }
    return renderFunc(templates[name], data);
}

const include = (name, data) => append(render(name, run(data)))

const escape = (html) => String(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')

const parse = (str) => {
    var res = "", ln = 0, len = str.length, open = "<%", close = "%>", normal = false;
    for (var i = 0; i < len; i++) {
        var c = str[i];
        if (str[i] === open[0] && str.slice(i, i + open.length) === open) {
            
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

const compile = (html) => new Function("data, include, append, escape", "with (data || {}) { " + parse(html) + " } ")




// Tests

// console.log(renderFunc(compile(html), { str: "901\n", num: 5 }));

// console.log(render(html, { str: "901\n", num: 5 }));

console.log(render("a.html", {
    str: "this is in a",
    num: 3,
    id: "id"
}))
