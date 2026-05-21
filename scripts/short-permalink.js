"use strict";

// Keep source filenames date-prefixed, but publish shorter URLs.
// Example:
//   source/_posts/2026-05-20-proactive-agent-background-attention-layer.md
//   /2026/05/20/proactive-agent-background-attention-layer/
//
// A post can override the generated slug with front matter:
//   short_slug: proactive-agent-attention

hexo.extend.filter.register(
  "post_permalink",
  function useShortPostSlug(data) {
    if (!data || typeof data !== "object" || data.__permalink) return data;

    const sourceSlug = data.slug;
    if (typeof sourceSlug !== "string") return data;

    const publishSlug = data.short_slug || sourceSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    if (publishSlug === sourceSlug) return data;

    const cloned = Object.create(data);
    cloned.slug = publishSlug;
    return cloned;
  },
  9
);
