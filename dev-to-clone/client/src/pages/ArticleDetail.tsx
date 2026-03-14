import { useRoute } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Heart, MessageCircle, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ArticleDetail() {
  const [, params] = useRoute("/articles/:slug");
  const slug = params?.slug as string;
  const { isAuthenticated, user } = useAuth();
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading } = trpc.posts.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const { data: comments = [] } = trpc.comments.getByPost.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post }
  );

  const { data: reactions = [] } = trpc.reactions.getByPost.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post }
  );

  const { data: isSaved = false } = trpc.savedPosts.isSaved.useQuery(
    { postId: post?.id || 0 },
    { enabled: !!post && isAuthenticated }
  );

  const addReactionMutation = trpc.reactions.add.useMutation();
  const createCommentMutation = trpc.comments.create.useMutation();
  const savePostMutation = trpc.savedPosts.save.useMutation();
  const unsavePostMutation = trpc.savedPosts.unsave.useMutation();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">Article not found</p>
          <Link href="/">
            <a className="text-accent hover:underline">Back to home</a>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleReact = () => {
    if (!isAuthenticated) {
      alert("Please log in to react");
      return;
    }
    addReactionMutation.mutate({ postId: post.id, type: "heart" });
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      alert("Please log in to save");
      return;
    }
    if (isSaved) {
      unsavePostMutation.mutate({ postId: post.id });
    } else {
      savePostMutation.mutate({ postId: post.id });
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to comment");
      return;
    }
    if (!commentText.trim()) return;

    createCommentMutation.mutate(
      {
        postId: post.id,
        content: commentText,
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
      }
    );
  };

  return (
    <MainLayout>
      <article className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-accent hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to articles
          </a>
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>By Author</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.viewCount} views</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-8">
          <div className="text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 py-6 border-y border-border">
          <Button
            onClick={handleReact}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Heart className={`w-5 h-5 ${reactions.length > 0 ? "fill-current text-red-500" : ""}`} />
            <span>{reactions.length}</span>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{comments.length}</span>
          </Button>
          <Button
            onClick={handleSave}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 ml-auto"
          >
            <Share2 className="w-5 h-5" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {isAuthenticated && (
            <form onSubmit={handleComment} className="mb-8">
              <div className="article-card">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  rows={4}
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="button-primary"
                  >
                    Post Comment
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCommentText("")}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="article-card-compact">
                  <div className="flex gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`}
                      alt="Commenter"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Commenter</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-foreground">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </article>
    </MainLayout>
  );
}
