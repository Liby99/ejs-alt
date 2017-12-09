var fs = require("fs");
var path = require("path");



function readFile(filename, success, error) {
    var currDir = __dirname;
    fs.readFile(__dirname + "/" + filename, 'utf8', (err, data) => {
        if (err) {
            error(err);
        }
        else {
            success(data);
        }
    });
}

function compile(filename, success, error) {
    readFile(filname, (data) => {
        
        var open = "<%", close = "%>";
        var res = "", ln = 0, len = data.length;
        for (var i = 0; i < len; i++) {
            var c = data[i];
            if (data.slice(i, i + open.length) === open) {
                
            }
            else if (c == "\\") {
                res += "\\\\";
            }
            else if (c == "\"") {
                res += "\\\"";
            }
            else {
                res += c;
            }
        }
        
    }, error);
}

function render(filename, data, callback, error) {
    compile(filename, function (fn) {
        try {
            callback(fn(data));
        }
        catch (err) {
            error(err);
        }
    }, error);
}

compile("test.html", function (data) {
    console.log(data);
}, function (err) {
    console.error(err);
})
