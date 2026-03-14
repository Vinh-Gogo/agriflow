import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface ArticleCardProps {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  author: {
    id: number;
    name?: string;
    avatar?: string;
  };
  createdAt: Date;
  tags?: Array<{ id: number; name: string; slug: string }>;
  reactionsCount?: number;
  commentsCount?: number;
  viewCount?: number;
  isSaved?: boolean;
  onReact?: () => void;
  onSave?: () => void;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  coverImage,
  author,
  createdAt,
  tags,
  reactionsCount = 0,
  commentsCount = 0,
  isSaved = false,
  onReact,
  onSave,
}: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <article className="article-card group">
      <div className="flex gap-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <img
            src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.id}`}
            alt={author.name || "Author"}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author & Date */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm text-foreground">
              {author.name || "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo}
            </span>
          </div>

          {/* Title */}
          <Link href={`/articles/${slug}`}>
            <a className="block mb-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-200 line-clamp-2">
                {title}
              </h3>
            </a>
          </Link>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                  <a className="tag-badge text-xs">
                    #{tag.name}
                  </a>
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button
              onClick={onReact}
              className="flex items-center gap-1 hover:text-accent transition-colors duration-200"
            >
              <Heart className="w-4 h-4" />
              <span>{reactionsCount}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-accent transition-colors duration-200">
              <MessageCircle className="w-4 h-4" />
              <span>{commentsCount}</span>
            </button>
            <button
              onClick={onSave}
              className={`flex items-center gap-1 transition-colors duration-200 ${
                isSaved
                  ? "text-accent"
                  : "hover:text-accent"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {coverImage && (
          <div className="hidden sm:block flex-shrink-0">
            <img
              src={coverImage}
              alt={title}
              className="w-32 h-32 rounded-lg object-cover"
            />
          </div>
        )}
      </div>
    </article>
  );
}
