import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  image,
  schema,
}) => {
  return (
    <Helmet>
      {/* BASIC SEO */}
      <title>{title}</title>
      {description && (
        <meta name="description" content={description} />
      )}

      {/* CANONICAL TAG (MOST IMPORTANT) */}
      <link rel="canonical" href={url} />

      {/* OPEN GRAPH */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description && (
        <meta property="og:description" content={description} />
      )}
      <meta property="og:url" content={url} />
      {image && (
        <meta property="og:image" content={image} />
      )}

      {/* TWITTER */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && (
        <meta name="twitter:description" content={description} />
      )}
      {image && (
        <meta name="twitter:image" content={image} />
      )}

      {/* STRUCTURED DATA */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;