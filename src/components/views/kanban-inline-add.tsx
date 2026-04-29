"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface KanbanInlineAddProps {
  onAdd: (title: string, priority: string) => void;
}

const priorities = [
  { value: "low", label: "Low", class: "text-priority-low" },
  { value: "medium", label: "Med", class: "text-priority-medium" },
  { value: "high", label: "High", class: "text-priority-high" },
  { value: "urgent", label: "Urgent", class: "text-priority-urgent" },
];

export default function KanbanInlineAdd({ onAdd }: KanbanInlineAddProps) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), priority);
    setTitle("");
    setPriority("medium");
    setExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setPriority("medium");
    setExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!expanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground h-8 text-xs"
        onClick={() => setExpanded(true)}
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add task
      </Button>
    );
  }

  return (
    <div className="rounded-md border bg-card p-2.5 space-y-2">
      <Input
        ref={inputRef}
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-8 text-sm"
      />
      <div className="flex items-center gap-1.5">
        {priorities.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPriority(p.value)}
            className={cn(
              "h-6 px-2 rounded-md text-[10px] font-medium border transition-colors",
              priority === p.value
                ? "bg-muted border-border text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            {p.label}
          </button>
        ))}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-7 w-7"
          onClick={handleCancel}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          className="h-7 text-xs px-2.5"
          onClick={handleSubmit}
          disabled={!title.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
