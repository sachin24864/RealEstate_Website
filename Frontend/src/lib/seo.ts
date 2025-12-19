// Frontend/src/lib/seo.ts
export function addOrUpdateMeta(opts: { name?: string; property?: string; content: string }) {
  const selector = opts.name ? `meta[name="${opts.name}"]` : `meta[property="${opts.property}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (opts.name) el.setAttribute("name", opts.name);
    if (opts.property) el.setAttribute("property", opts.property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", opts.content);
}

export function setTitle(title: string) {
  document.title = title;
}

export function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export function removeSeoTags(selectors: string[]) {
  selectors.forEach((sel) => {
    const el = document.head.querySelector(sel);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  });
}