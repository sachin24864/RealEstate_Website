export function robotsHandler(req, res) {
  res.type("text/plain");
  res.send(`
User-agent: *
Allow: /

Sitemap: https://naveenassociatesgroup.com/sitemap.xml
  `.trim());
}
