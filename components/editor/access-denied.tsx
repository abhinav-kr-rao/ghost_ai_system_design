import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold">Access denied</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          You do not have permission to view this workspace or it no longer exists.
        </p>
        <Button asChild>
          <Link href="/editor">Back to editor</Link>
        </Button>
      </div>
    </div>
  );
}
