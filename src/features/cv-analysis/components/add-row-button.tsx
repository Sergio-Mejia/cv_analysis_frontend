import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AddRowButtonProps {
  label: string;
  onClick: () => void;
}

export function AddRowButton({ label, onClick }: AddRowButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="mt-3.5 h-auto self-start rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-normal text-muted-foreground hover:border-primary hover:bg-transparent hover:text-primary dark:hover:bg-transparent"
    >
      <PlusIcon />
      {label}
    </Button>
  );
}
