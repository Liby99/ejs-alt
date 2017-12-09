function anonymous(data, include, append, escape/* `` */) {
    with (data || {}) {
        include('b.html', {
            content: () => {
                append("\n    <p>");
                append(escape(num));
                append("</p>\n    <p>678</p>\n");
            },
            num: num
        });
        append("\n<p>");
        append(escape(str));
        append("</p>\n<span id=\"");
        append(escape(id));
        append("\">Hahahahaha</span>\n");
    }
}
