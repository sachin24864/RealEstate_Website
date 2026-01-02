import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Spin, message } from "antd";
import { blogClint } from "@/store";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface BlogItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
}

export default function BlogOverview() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let previousTitle = document.title;
    const previousMetaTags: HTMLMetaElement[] = Array.from(
      document.head.querySelectorAll('meta[name="description"], meta[name="keywords"], meta[property^="og:"], meta[name^="twitter:"]')
    );
    const previousCanonical = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");

    // Save HTML of previous meta tags to restore easily
    const previousMetaHTML = previousMetaTags.map((t) => t.outerHTML).join("");
    const previousCanonicalHref = previousCanonical?.href || null;

    const addOrUpdateMeta = (opts: { name?: string; property?: string; content: string }) => {
      const selector = opts.name ? `meta[name="${opts.name}"]` : `meta[property="${opts.property}"]`;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        if (opts.name) el.setAttribute("name", opts.name);
        if (opts.property) el.setAttribute("property", opts.property);
        document.head.appendChild(el);
      }
      el.content = opts.content;
    };

    const setCanonical = (href: string) => {
      let link = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = href;
    };

    const removeInjected = () => {
      // Remove any meta tags we add with property/name checks (we remove by matching values we set below)
      const keys = [
        'description',
        'keywords',
      ];
      keys.forEach((k) => {
        const m = document.head.querySelector(`meta[name="${k}"]`);
        if (m && !previousMetaHTML.includes(m.outerHTML)) m.remove();
      });

      const ogKeys = ['og:title','og:description','og:image','og:url'];
      ogKeys.forEach(k => {
        const m = document.head.querySelector(`meta[property="${k}"]`);
        if (m && !previousMetaHTML.includes(m.outerHTML)) m.remove();
      });

      const twKeys = ['twitter:card','twitter:title','twitter:description','twitter:image'];
      twKeys.forEach(k => {
        const m = document.head.querySelector(`meta[name="${k}"]`);
        if (m && !previousMetaHTML.includes(m.outerHTML)) m.remove();
      });

      // restore canonical
      if (previousCanonicalHref) {
        setCanonical(previousCanonicalHref);
      } else {
        const curr = document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");
        if (curr && !previousCanonical) curr.remove();
      }

      // restore title
      document.title = previousTitle;
    };

    const fetchBlog = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await blogClint.getBlogBySlug(slug);
        const b: BlogItem | undefined = res.blog;
        if (!b) {
          setBlog(null);
          return;
        }
        setBlog(b);

        // Title
        const title = b.metaTitle || b.title;
        document.title = title;

        // Basic meta
        const description = b.metaDescription || (b.description || "").substring(0, 160);
        addOrUpdateMeta({ name: "description", content: description });

        if (b.metaKeywords) addOrUpdateMeta({ name: "keywords", content: b.metaKeywords });

        // Open Graph
        addOrUpdateMeta({ property: "og:title", content: title });
        addOrUpdateMeta({ property: "og:description", content: description });

        const imageUrl = b.image && (b.image.startsWith("http") ? b.image : `${BACKEND_URL}${b.image}`);
        if (imageUrl) {
          addOrUpdateMeta({ property: "og:image", content: imageUrl });
          addOrUpdateMeta({ name: "twitter:image", content: imageUrl });
        }

        addOrUpdateMeta({ property: "og:url", content: window.location.href });

        // Twitter card
        addOrUpdateMeta({ name: "twitter:card", content: "summary_large_image" });
        addOrUpdateMeta({ name: "twitter:title", content: title });
        addOrUpdateMeta({ name: "twitter:description", content: description });

        // canonical
        const canonicalUrl = `${window.location.origin}/blog/${b._id}`;
        setCanonical(canonicalUrl);

      } catch (err) {
        console.error("Failed to fetch blog:", err);
        message.error("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();

    return () => {
      // clean up: remove tags we injected and restore previous canonical/title/meta where possible
      // simplest safe restore: remove injected tags & restore previous canonical and title
      removeInjected();
      // re-add previous metas if they existed
      if (previousMetaHTML) {
        // insert previous meta HTML snippets (best-effort)
        // remove current ones that overlap, then append previous
        const container = document.createElement("div");
        container.innerHTML = previousMetaHTML;
        Array.from(container.children).forEach(ch => document.head.appendChild(ch));
      }
      if (previousCanonicalHref) {
        setCanonical(previousCanonicalHref);
      }
      document.title = previousTitle;
    };
  }, [slug]);

  const imgSrc =
    blog?.image && (blog.image.startsWith("http") ? blog.image : `${BACKEND_URL}${blog.image}`);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" />
            </div>
          ) : blog ? (
            <article className="bg-white rounded-md overflow-hidden shadow">
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={blog.title}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999'%3EImage not available%3C/text%3E%3C/svg%3E";
                  }}
                />
              )}
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                <p className="text-sm text-gray-500 mb-6">{new Date(blog.createdAt).toLocaleString()}</p>
                <div className="prose max-w-none text-gray-800">
                  <p>{blog.description}</p>
                </div>
              </div>
            </article>
          ) : (
            <div className="text-center py-20">Blog not found</div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}