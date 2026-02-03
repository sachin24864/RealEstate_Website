import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import Blog from "../models/blog.js";
import Property from "../models/Properties.js";

export async function sitemapHandler(req, res) {
  try {
    const links = [];

    // ✅ STATIC PAGES
    links.push(
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/about-us", changefreq: "monthly", priority: 0.8 },
      { url: "/contact", changefreq: "monthly", priority: 0.8 },
      { url: "/blog", changefreq: "daily", priority: 0.9 },
      { url: "/gallery", changefreq: "monthly", priority: 0.6 }
    );

    // ✅ BLOGS
    const blogs = await Blog.find({}, "slug updatedAt");
    blogs.forEach(blog => {
      links.push({
        url: `/blog/${blog.slug}`,
        lastmod: blog.updatedAt,
        changefreq: "weekly",
        priority: 0.8
      });
    });

    // ✅ PROPERTIES
    const properties = await Property.find({}, "slug updatedAt");
    properties.forEach(property => {
      links.push({
        url: `/property/${property.slug}`,
        lastmod: property.updatedAt,
        changefreq: "weekly",
        priority: 0.9
      });
    });

    const stream = new SitemapStream({
      hostname: "https://naveenassociatesgroup.com"
    });

    res.header("Content-Type", "application/xml");

    const xml = await streamToPromise(
      Readable.from(links).pipe(stream)
    );

    res.send(xml.toString());
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).end();
  }
}
