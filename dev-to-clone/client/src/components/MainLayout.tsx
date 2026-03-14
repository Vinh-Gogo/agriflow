import Header from "./Header";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export default function MainLayout({ children, onSearch }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={onSearch} />
      <div className="container flex gap-6 py-8">
        <SidebarLeft />
        <main className="flex-1 min-w-0">
          {children}
        </main>
        <SidebarRight />
      </div>
    </div>
  );
}
