"use strict";

// Inject <link rel="canonical"> into all pages
hexo.extend.filter.register("after_render:html", function (str, data) {
  var config = hexo.config;
  if (!config.url) return str;

  // Build canonical URL from config.url + page path
  var url = config.url.replace(/\/$/, "");
  var path = data.path || "";

  // Normalize path: remove trailing index.html
  path = path.replace(/index\.html$/, "");

  // Ensure path starts with /
  if (path && path[0] !== "/") {
    path = "/" + path;
  }

  // Ensure trailing slash for directory-style URLs
  if (!path || path === "/") {
    path = "/";
  } else if (!path.match(/\.[a-zA-Z0-9]+$/)) {
    // No file extension, treat as directory - ensure trailing slash
    path = path.replace(/\/?$/, "/");
  }

  var canonical = url + path;
  var tag = '<link rel="canonical" href="' + canonical + '">';

  // Insert before </head>
  if (str.indexOf('rel="canonical"') === -1) {
    str = str.replace("</head>", "  " + tag + "\n</head>");
  }

  return str;
});
