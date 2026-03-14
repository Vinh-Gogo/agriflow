import { Link, useLocation } from "wouter";
import { Home, Bookmark, User, TrendingUp } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function SidebarLeft() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const { data: tags = [] } = trpc.tags.list.useQuery();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/trending", label: "Trending", icon: TrendingUp },
    ...(isAuthenticated ? [{ path: "/saved", label: "Saved", icon: Bookmark }] : []),
    ...(isAuthenticated && user ? [{ path: `/profile/${user.id}`, label: "Profile", icon: User }] : []),
  ];

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
      {/* Navigation */}
      <nav className="sidebar-section">
        <h3 className="sidebar-section-title">Navigation</h3>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={`sidebar-link flex items-center gap-2 ${
                    isActive(item.path) ? "active" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Popular Tags */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Popular Tags</h3>
        <div className="space-y-2">
          {tags.slice(0, 10).map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <a className="sidebar-link flex items-center justify-between group">
                <span className="flex items-center gap-2">
                  <span>#</span>
                  <span>{tag.name}</span>
                </span>
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="sidebar-section text-sm">
        <h3 className="sidebar-section-title">About</h3>
        <p className="text-muted-foreground mb-4">
          DEV Community is a place where coders share, stay up-to-date and grow their careers.
        </p>
        <div className="space-y-2">
          <Link href="/about">
            <a className="sidebar-link">About DEV</a>
          </Link>
          <Link href="/contact">
            <a className="sidebar-link">Contact</a>
          </Link>
          <Link href="/privacy">
            <a className="sidebar-link">Privacy</a>
          </Link>
        </div>
      </div>
    </aside>
  );
}
