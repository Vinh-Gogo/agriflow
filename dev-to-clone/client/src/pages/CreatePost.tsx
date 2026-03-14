import { useState } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Eye, Code } from "lucide-react";

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [preview, setPreview] = useState(false);

  const createPostMutation = trpc.posts.create.useMutation();

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            Please log in to create a post
          </p>
        </div>
      </MainLayout>
    );
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    createPostMutation.mutate(
      {
        title,
        slug: generateSlug(title),
        content,
        excerpt: excerpt || content.substring(0, 200),
        published: true,
      },
      {
        onSuccess: (result) => {
          setLocation("/");
        },
      }
    );
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Post</h1>
          <p className="text-muted-foreground">
            Share your knowledge and experience with our community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="input-elegant w-full"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Excerpt (optional)
            </label>
            <Input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of your post..."
              className="input-elegant w-full"
            />
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Content
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => setPreview(false)}
                  variant={!preview ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  type="button"
                  onClick={() => setPreview(true)}
                  variant={preview ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </div>
            </div>

            {!preview ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content here... (Markdown supported)"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none font-mono text-sm"
                rows={12}
              />
            ) : (
              <div className="article-card min-h-96">
                <div className="prose prose-invert max-w-none">
                  <div className="text-foreground whitespace-pre-wrap">
                    {content}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={createPostMutation.isPending}
              className="button-primary flex items-center gap-2"
            >
              {createPostMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Publish Post
            </Button>
            <Button
              type="button"
              onClick={() => setLocation("/")}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Help */}
        <div className="mt-12 article-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Markdown Guide
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-2"># Headings</p>
              <p># H1, ## H2, ### H3</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">**Bold** & *Italic*</p>
              <p>**bold text** and *italic text*</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">[Links](url)</p>
              <p>[Link text](https://example.com)</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">- Lists</p>
              <p>- Item 1, - Item 2, - Item 3</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
