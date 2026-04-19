import { Link } from "react-router-dom";
import { Mail, Twitter } from "lucide-react";
import { authorsApi, authorSlug, type MockAuthor } from "@/lib/mockStore";
import { useLanguage } from "@/hooks/useLanguage";

export default function AuthorCard({ name }: { name: string }) {
  const { isRTL } = useLanguage();
  const slug = authorSlug(name);
  const author: MockAuthor = authorsApi.byName(name) ?? { slug, name, bio: "", avatar_url: null };

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5 flex gap-4 items-start">
      <Link to={`/author/${slug}`} className="flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xl">
          {author.name[0]}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Link to={`/author/${slug}`} className="font-bold text-foreground hover:text-primary transition-colors">
            {author.name}
          </Link>
          <Link to={`/author/${slug}`} className="text-xs text-primary hover:underline">
            {isRTL ? "كل مقالات الكاتب ←" : "All articles →"}
          </Link>
        </div>
        {author.bio && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{author.bio}</p>}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          {author.twitter && (
            <a href={`https://twitter.com/${author.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
              <Twitter className="w-3 h-3" /> {author.twitter}
            </a>
          )}
          {author.email && (
            <a href={`mailto:${author.email}`} className="inline-flex items-center gap-1 hover:text-primary">
              <Mail className="w-3 h-3" /> {author.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
