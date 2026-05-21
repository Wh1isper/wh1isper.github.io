"use strict";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

hexo.extend.generator.register("legacy_redirects", function legacyRedirects(locals) {
  const redirects = [];
  const posts = locals.posts ? locals.posts.toArray() : [];

  for (const post of posts) {
    if (!post.date || typeof post.slug !== "string") continue;
    if (!/^\d{4}-\d{2}-\d{2}-/.test(post.slug)) continue;

    const legacyPath = `${post.date.format("YYYY")}/${post.date.format("MM")}/${post.date.format("DD")}/${post.slug}/`;
    if (legacyPath === post.path) continue;

    const target = hexo.config.root + post.path;
    redirects.push({
      path: legacyPath + "index.html",
      data: `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
  <link rel="canonical" href="${escapeHtml(target)}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${escapeHtml(target)}">${escapeHtml(target)}</a></p>
</body>
</html>
`,
    });
  }

  return redirects;
});
