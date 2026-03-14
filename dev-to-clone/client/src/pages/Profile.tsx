import { useRoute } from "wouter";
import MainLayout from "@/components/MainLayout";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const [, params] = useRoute("/profile/:userId");
  const userId = parseInt(params?.userId as string);
  const { user: currentUser } = useAuth();
  const [offset, setOffset] = useState(0);

  const { data: user } = trpc.auth.me.useQuery();

  const { data: posts = [], isLoading } = trpc.posts.getUserPosts.useQuery(
    { userId, limit: 20, offset },
    { enabled: !!userId }
  );

  const { data: reactions = [] } = trpc.reactions.getByPost.useQuery(
    { postId: posts[0]?.id || 0 },
    { enabled: posts.length > 0 }
  );

  const reactionsMap = new Map<number, number>();
  reactions.forEach((r) => {
    reactionsMap.set(r.postId, (reactionsMap.get(r.postId) || 0) + 1);
  });

  const isOwnProfile = currentUser?.id === userId;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="article-card mb-8">
          <div className="flex items-center gap-6">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user?.name || "User"}
              </h1>
              <p className="text-muted-foreground mb-4">
                {user?.bio || "No bio yet"}
              </p>
              {isOwnProfile && (
                <Button className="button-primary">Edit Profile</Button>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Articles ({posts.length})
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {isOwnProfile
                  ? "You haven't published any articles yet"
                  : "This user hasn't published any articles yet"}
              </p>
              {isOwnProfile && (
                <Link href="/create">
                  <a className="text-accent hover:underline">Create your first post</a>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <ArticleCard
                  key={post.id}
                  id={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt || undefined}
                  coverImage={post.coverImage || undefined}
                  author={{
                    id: post.userId,
                    name: user?.name || undefined,
                    avatar: user?.avatar || undefined,
                  }}
                  createdAt={post.createdAt}
                  tags={[]}
                  reactionsCount={reactionsMap.get(post.id) || 0}
                  commentsCount={0}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {posts.length > 0 && (
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
                disabled={posts.length < 20}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
