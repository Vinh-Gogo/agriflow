import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogOut } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="header-sticky">
      <div className="container flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center gap-2 text-2xl font-bold text-accent">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
              D
            </div>
            <span className="hidden sm:inline">DEV</span>
          </a>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-elegant pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </form>

        {/* Auth Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {isAuthenticated && user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-foreground hidden md:inline">
                  {user.name}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
              >
                <a href={getLoginUrl()}>Log in</a>
              </Button>
              <Button
                asChild
                size="sm"
                className="button-primary hidden sm:inline-flex"
              >
                <a href={getLoginUrl()}>Sign up</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
