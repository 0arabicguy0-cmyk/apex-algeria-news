import logoAsset from "@/assets/max-news-logo.jpg.asset.json";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export default function BrandLogo({ className = "", imageClassName = "", priority = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`}>
      <img
        src={logoAsset.url}
        alt="MAX NEWS"
        className={`h-full w-full object-cover ${imageClassName}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </span>
  );
}