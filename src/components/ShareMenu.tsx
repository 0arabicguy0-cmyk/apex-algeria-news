import { useState } from "react";
import { Share2, Link2, Check, Facebook, MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface ShareMenuProps {
  title: string;
  url?: string;
  className?: string;
}

export default function ShareMenu({ title, url, className }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const links = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("تم نسخ الرابط");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("تعذر نسخ الرابط");
    }
  };

  const handleNative = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, url: shareUrl });
        setOpen(false);
        return true;
      } catch {}
    }
    return false;
  };

  const items = [
    {
      key: "whatsapp",
      label: "واتساب",
      icon: MessageCircle,
      color: "text-[#25D366]",
      onClick: () => window.open(links.whatsapp, "_blank"),
    },
    {
      key: "facebook",
      label: "فيسبوك",
      icon: Facebook,
      color: "text-[#1877F2]",
      onClick: () => window.open(links.facebook, "_blank"),
    },
    {
      key: "twitter",
      label: "X / تويتر",
      icon: Share2,
      color: "text-foreground",
      onClick: () => window.open(links.twitter, "_blank"),
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={async (e) => {
            if (await handleNative()) e.preventDefault();
          }}
          className={`p-2 rounded-full hover:bg-muted text-foreground transition-all hover:scale-110 ${className ?? ""}`}
          aria-label="مشاركة"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-56 p-2 animate-scale-in"
        dir="rtl"
      >
        <div className="space-y-1">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => {
                it.onClick();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-foreground"
            >
              <it.icon className={`w-4 h-4 ${it.color}`} />
              <span>{it.label}</span>
            </button>
          ))}
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-foreground border-t border-border mt-1 pt-2"
          >
            {copied ? (
              <Check className="w-4 h-4 text-dz-green" />
            ) : (
              <Link2 className="w-4 h-4 text-primary" />
            )}
            <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
