"use client";

import {
  CalendarDays,
  Command,
  Kanban,
  LayoutList,
  LogOut,
  Moon,
  Plus,
  Search,
  Sun,
  Timer,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import type { SerializableProject } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ViewId = "list" | "kanban" | "calendar" | "timeline";

interface SidebarProps {
  currentView: ViewId;
  onViewChange: (view: ViewId) => void;
  onSearchOpen: () => void;
  onNewTask: () => void;
  projects: SerializableProject[];
}

const views: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "list", label: "List", icon: LayoutList },
  { id: "kanban", label: "Kanban", icon: Kanban },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "timeline", label: "Timeline", icon: Timer },
];

export default function Sidebar({
  currentView,
  onViewChange,
  onSearchOpen,
  onNewTask,
  projects,
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
      router.refresh();
    } catch {
      // silently fail
    }
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex h-12 items-center gap-2 border-b px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
          T
        </div>
        <span className="font-semibold text-sm tracking-tight">Teamon</span>
      </div>

      {/* Search + New Task */}
      <div className="flex items-center gap-2 px-3 py-3">
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex flex-1 items-center gap-2 rounded-md border bg-background/50 px-2.5 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="hidden rounded border bg-muted px-1 py-0.5 font-mono text-[10px] lg:inline-block">
            <Command className="mr-0.5 inline h-2.5 w-2.5" />K
          </kbd>
        </button>
        <Button
          size="icon-xs"
          variant="outline"
          onClick={onNewTask}
          className="shrink-0"
          title="New task (C)"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Views */}
      <nav className="flex flex-col gap-0.5 px-2">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          return (
            <button
              type="button"
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60",
              )}
            >
              <Icon className="h-4 w-4" />
              {view.label}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="my-2 border-t" />

      {/* Projects */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
        <div className="flex items-center justify-between px-2.5 py-1">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Projects
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="opacity-0 hover:opacity-100"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        {projects.map((project) => (
          <button
            type="button"
            key={project.id}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            {project.name}
          </button>
        ))}
        {projects.length === 0 && (
          <div className="px-2.5 py-3 text-xs text-muted-foreground">
            No projects yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-2 flex flex-col gap-1">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" /> Light mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" /> Dark mode
            </>
          )}
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60"
            >
              <User className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate text-left">
                {user?.name ?? user?.email ?? "Account"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-56">
            <DropdownMenuLabel className="truncate">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
