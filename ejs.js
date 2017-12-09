module.exports = ejs = (function () {
    
    const fs = require("fs");
    const path = require("path");
    
    let EJS = {
        
        stack: [],
        template: {},
        
        copy (obj) {
            n = {};
            for (var i in obj)
                n[i] = obj[i];
            return n;
        },
        
        peek () {
            return this.stack[this.stack.length - 1];
        },
        
        peekPath () {
            return this.stack.length ? path.dirname(this.peek().path) : ("/");
        },
        
        pop () {
            return this.stack.pop();
        },
        
        push (name, data) {
            if (name)
                var obj = { path: this.resolve(name), data: data, html: "" };
            else
                var obj = this.copy(this.peek());
            this.stack.push(obj);
            return obj;
        },
        
        resolve (name) {
            return path.join(this.peekPath(), name);
        },
        
        readFile (fullpath) {
            return fs.readFileSync(fullpath, "utf8");
        },
        
        genFuncBody (body) {
            return "try {" +
                "with (data || {}) {" +
                    body +
                "}" +
            "} catch (err) {" +
                "throw err;" +
            "}";
        },
        
        compile (html) {
            return new Function("data", "include", "append", "escape", this.genFuncBody(this.parse(html)));
        },
        
        compileFile (fullpath) {
            var self = this, fn = this.compile(this.readFile(fullpath));
            var include = this.include.bind(this),
                append = this.append.bind(this),
                escape = this.escape.bind(this);
            return (data) => {
                fn(data, include, append, escape);
            };
        },
        
        getCompiled (fullpath) {
            if (!this.template[fullpath]) {
                this.template[fullpath] = this.compileFile(fullpath);
            }
            return this.template[fullpath];
        },
        
        renderFunc (fn) {
            var context = this.push();
            fn(context.data);
            return this.pop().html;
        },
        
        renderFile (name, data) {
            var context = this.push(name, data);
            this.getCompiled(context.path)(data);
            return this.pop().html;
        },
        
        procIncData (d) {
            var self = this, procIncData = this.procIncData.bind(this);
            if (d instanceof Function)
                return this.renderFunc(d);
            else if (d instanceof Array)
                return d.map((o) => procIncData(o));
            else if (d instanceof Object)
                return Object.keys(d).reduce((p, c) => {
                    p[c] = procIncData(d[c]);
                    return p;
                }, {});
            else
                return d;
        },
        
        append (str) {
            this.stack[this.stack.length - 1].html += str;
        },
        
        include (name, data) {
            this.append(this.renderFile(name, this.procIncData(data)));
        },
        
        escape (str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;')
        },
        
        parse (str) {
            var res = "", ln = 0, len = str.length, open = "<%", close = "%>", normal = false, pre, post;
            for (var i = 0; i < len; i++) {
                var c = str[i];
                if (str[i] === open[0] && str.slice(i, i + open.length) === open) {
                    
                    if (normal) { res += "\");"; normal = false; }
                    
                    i += open.length;
                    
                    switch (str[i]) {
                        case '=': pre = "append(escape("; post = "));"; i++; break;
                        case '-': pre = "append("; post = ");"; i++; break;
                        default: pre = ""; post = "";
                    }
                    
                    var j = str.indexOf(close, i);
                    
                    if (j < 0) throw new Error("Could not find matching close tag");
                    
                    var js = str.substring(i, j);
                    
                    res += pre + js.trim() + post;
                    i += j - i + close.length - 1;
                }
                else {
                    
                    if (!normal) { res += "append(\""; normal = true; }
                    
                    if (c == "\\") res += "\\\\";
                    else if (c == "\"") res += "\\\"";
                    else if (c == "\n") res += "\\n";
                    else res += c;
                }
            }
            
            if (normal) { res += "\");"; normal = false; }
            return res;
        }
    };
    
    return {
        render: EJS.renderFile.bind(EJS),
        __express: function (path, options, callback) {
            
            if ('function' == typeof options) {
                callback = options, options = {};
            }
            
            try {
                // console.log(options);
                var result = EJS.renderFile(path, options);
            }
            catch (err) {
                callback(err);
                return;
            }
            callback(null, result);
        }
    }
})();
