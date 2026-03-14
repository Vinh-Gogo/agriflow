import { useState, useMemo } from "react";
import MainLayout from "@/components/MainLayout";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

type SortBy = "latest" | "top";

export default function Home() {
  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const { isAuthenticated, user } = useAuth();

  const { data: posts = [], isLoading, isFetching } = trpc.posts.list.useQuery({
    limit: 20,
    offset,
    sortBy,
  });

  const { data: reactions = [] } = trpc.reactions.getByPost.useQuery(
    { postId: posts[0]?.id || 0 },
    { enabled: posts.length > 0 }
  );

  const { data: savedPosts = [] } = trpc.savedPosts.list.useQuery(
    { limit: 100, offset: 0 },
    { enabled: isAuthenticated }
  );

  const addReactionMutation = trpc.reactions.add.useMutation();
  const savePostMutation = trpc.savedPosts.save.useMutation();
  const unsavePostMutation = trpc.savedPosts.unsave.useMutation();

  const savedPostIds = useMemo(
    () => new Set(savedPosts.map((p) => p.id)),
    [savedPosts]
  );

  const reactionsMap = useMemo(() => {
    const map = new Map<number, number>();
    reactions.forEach((r) => {
      map.set(r.postId, (map.get(r.postId) || 0) + 1);
    });
    return map;
  }, [reactions]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setOffset(0);
  };

  const handleReact = (postId: number) => {
    if (!isAuthenticated) {
      alert("Please log in to react to posts");
      return;
    }
    addReactionMutation.mutate({ postId, type: "heart" });
  };

  const handleSave = (postId: number) => {
    if (!isAuthenticated) {
      alert("Please log in to save posts");
      return;
    }
    if (savedPostIds.has(postId)) {
      unsavePostMutation.mutate({ postId });
    } else {
      savePostMutation.mutate({ postId });
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  return (
    <MainLayout onSearch={handleSearch}>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-border pb-4">
          <Button
            onClick={() => {
              setSortBy("latest");
              setOffset(0);
            }}
            variant={sortBy === "latest" ? "default" : "ghost"}
            className={sortBy === "latest" ? "border-b-2 border-accent" : ""}
          >
            Latest
          </Button>
          <Button
            onClick={() => {
              setSortBy("top");
              setOffset(0);
            }}
            variant={sortBy === "top" ? "default" : "ghost"}
            className={sortBy === "top" ? "border-b-2 border-accent" : ""}
          >
            Top
          </Button>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery
                  ? `No articles found matching "${searchQuery}"`
                  : "No articles yet. Be the first to share!"}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <ArticleCard
                key={post.id}
                id={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt || undefined}
                coverImage={post.coverImage || undefined}
                author={{
                  id: post.userId,
                  name: "Author",
                  avatar: undefined,
                }}
                createdAt={post.createdAt}
                tags={[]}
                reactionsCount={reactionsMap.get(post.id) || 0}
                commentsCount={0}
                isSaved={savedPostIds.has(post.id)}
                onReact={() => handleReact(post.id)}
                onSave={() => handleSave(post.id)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredPosts.length > 0 && (
          <div className="flex gap-4 justify-center py-8">
            <Button
              onClick={() => setOffset(Math.max(0, offset - 20))}
              disabled={offset === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setOffset(offset + 20)}
              disabled={isFetching || filteredPosts.length < 20}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
