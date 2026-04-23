import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks/useLanguage";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  type?: "website" | "article";
  canonical?: string;
}

const SITE_NAME = "Apex News DZ";
const DEFAULT_DESC_AR = "أبكس نيوز الجزائر — مصدرك الأول للأخبار الجزائرية والعربية والدولية.";
const DEFAULT_DESC_EN = "Apex News DZ — your first source for Algerian, Arab and international news.";

export default function SEO({
  title,
  description,
  keywords,
  author = SITE_NAME,
  image,
  type = "website",
  canonical,
}: SEOProps) {
  const { lang, isRTL } = useLanguage();
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const desc = description || (lang === "en" ? DEFAULT_DESC_EN : DEFAULT_DESC_AR);
  const url = canonical || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      <html lang={lang} dir={isRTL ? "rtl" : "ltr"} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
