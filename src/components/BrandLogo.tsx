import logo from "@/assets/max-news-logo.jpg";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export default function BrandLogo({
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`}>
      <img
        src={logo}
        alt="MAX NEWS"
        className={`h-full w-full object-cover ${imageClassName}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </span>
  );
}