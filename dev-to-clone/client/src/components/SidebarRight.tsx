import { Link } from "wouter";
import { Zap, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarRight() {
  return (
    <aside className="hidden xl:block w-72 flex-shrink-0 space-y-6">
      {/* Create Post CTA */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Share Your Knowledge</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Write and share your thoughts, experiences, and expertise with our community.
        </p>
        <Button className="button-primary w-full">
          <Link href="/create">
            <a className="w-full">Create Post</a>
          </Link>
        </Button>
      </div>

      {/* Community Stats */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Community</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Active Members</p>
              <p className="text-lg font-semibold text-foreground">3.7M+</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Articles</p>
              <p className="text-lg font-semibold text-foreground">500K+</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Weekly Active</p>
              <p className="text-lg font-semibold text-foreground">100K+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Featured</h3>
        <div className="space-y-3">
          {[
            "Getting Started with React 19",
            "Advanced TypeScript Patterns",
            "Web Performance Optimization",
          ].map((title, idx) => (
            <Link key={idx} href="/">
              <a className="block p-2 rounded-md hover:bg-muted transition-colors duration-200">
                <p className="text-sm font-medium text-foreground hover:text-accent line-clamp-2">
                  {title}
                </p>
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Newsletter</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get the best articles delivered to your inbox weekly.
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="input-elegant w-full text-sm"
          />
          <Button className="button-primary w-full text-sm">Subscribe</Button>
        </form>
      </div>
    </aside>
  );
}
