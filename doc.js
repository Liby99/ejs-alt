// Index.html:
// <% include("/view/navbar.html"); %>
// <% include("/view/sidebar.html", { content: () => { %>
//     <ul>
//         <li>1234</li>
//         <li>5678</li>
//     </ul>
// <% }}); %>
// <div><%= title %></div>

Stack: [], Templates: {}
EJS.render("/index.html", { title: "index" });

    filename = EJS.resolve("/index.html") = __dirname join "/index.html";
    file = EJS.readFile("/index.html");
    fn = EJS.compile(file)
        funcstr = EJS.parse(file)
    
    Stack: [{ name: "/index.html", html: "" }], Templates: { "/index.html": fn }
    EJS.renderFunc(fn, { title: "index" })
        
        Stack: [{ name: "/index.html", html: "" }], Templates: { "/index.html": fn }
        EJS.pushStack();
        
        Stack: [{ name: "/index.html", html: "" }, { name: "/index.html", html: "" }], Templates: { "/index.html": fn }
        fn({ title: "index" });
            
            Stack: [{ name: "/index.html", html: "" }], Templates: { "/index.html": fn }
            EJS.include("/view/navbar.html")
                
                Stack: [{ name: "/index.html", html: "" }], Templates: { "/index.html": fn }
                EJS.render("/view/navbar.html", {})
                    filename = EJS.resolve("/index.html") = "/index.html" join "/view/navbar.html";
                    file = EJS.readFile("/view/navbar.html");
                    fn2 = EJS.compile(file);
                        funcstr = EJS.parse(file);
                    
                    Stack: [{ name: "/index.html", html: "" }]
                    Templates: { "/index.html": fn, "/view/navbar.html": fn2 }
                    EJS.renderFunc(fn2);
                        
                        Stack: [
                            { name: "/index.html", html: "" },
                            { name: "/view/navbar.html", html: ""}
                        ]
            
