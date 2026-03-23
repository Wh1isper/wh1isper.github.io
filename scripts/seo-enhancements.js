"use strict";

// SEO enhancements: og:image fallback + JSON-LD structured data

var defined_default_image = "/img/banner.png";

hexo.extend.filter.register("after_render:html", function (str, data) {
  var config = hexo.config;
  if (!config.url) return str;

  var url = config.url.replace(/\/$/, "");

  // --- 1. og:image fallback ---
  if (str.indexOf('og:image') === -1) {
    var ogImage = null;

    // Try banner_img from front-matter
    if (data.page && data.page.banner_img) {
      ogImage = data.page.banner_img;
    } else if (data.page && data.page.index_img) {
      ogImage = data.page.index_img;
    }

    // Fall back to default
    if (!ogImage) {
      ogImage = defined_default_image;
    }

    // Ensure absolute URL
    if (ogImage && ogImage.indexOf("http") !== 0) {
      ogImage = url + (ogImage[0] === "/" ? "" : "/") + ogImage;
    }

    if (ogImage) {
      var ogImageTag = '<meta property="og:image" content="' + ogImage + '">';
      str = str.replace("</head>", "  " + ogImageTag + "\n</head>");
    }
  }

  // --- 2. JSON-LD structured data for posts ---
  if (
    data.page &&
    data.page.layout === "post" &&
    data.page.title &&
    str.indexOf("application/ld+json") === -1
  ) {
    var page = data.page;
    var path = (data.path || "").replace(/index\.html$/, "");
    if (path && path[0] !== "/") path = "/" + path;

    var pageUrl = url + path;
    var description = page.description || page.excerpt || "";
    if (description) {
      description = description
        .replace(/<[^>]*>/g, "")
        .substring(0, 200)
        .trim();
    }

    var datePublished = page.date
      ? new Date(page.date).toISOString()
      : "";
    var dateModified = page.updated
      ? new Date(page.updated).toISOString()
      : datePublished;

    var author = page.author || config.author || "";

    // Build image URL for schema
    var schemaImage = "";
    if (page.banner_img) {
      schemaImage =
        page.banner_img.indexOf("http") === 0
          ? page.banner_img
          : url + (page.banner_img[0] === "/" ? "" : "/") + page.banner_img;
    }

    var jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: page.title,
      url: pageUrl,
      datePublished: datePublished,
      dateModified: dateModified,
      author: {
        "@type": "Person",
        name: author,
      },
      publisher: {
        "@type": "Person",
        name: author,
      },
      description: description,
    };

    if (schemaImage) {
      jsonLd.image = schemaImage;
    }

    var script =
      '<script type="application/ld+json">' +
      JSON.stringify(jsonLd) +
      "</script>";
    str = str.replace("</head>", "  " + script + "\n</head>");
  }

  return str;
});
