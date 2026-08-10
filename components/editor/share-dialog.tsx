"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Copy, Loader2, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CollaboratorRecord {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface ShareDialogProps {
  projectId: string;
  projectName: string;
  isOwner: boolean;
}

export function ShareDialog({ projectId, projectName, isOwner }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [collaborators, setCollaborators] = useState<CollaboratorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadCollaborators = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!response.ok) {
        throw new Error("Unable to load collaborators.");
      }

      const payload = (await response.json()) as {
        collaborators: CollaboratorRecord[];
      };
      setCollaborators(payload.collaborators ?? []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Unable to load collaborators.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadCollaborators();
  }, [loadCollaborators, open]);

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to invite collaborator.");
      }

      setEmail("");
      await loadCollaborators();
    } catch (inviteError) {
      setError(
        inviteError instanceof Error
          ? inviteError.message
          : "Unable to invite collaborator.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (collaboratorEmail: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: collaboratorEmail }),
      });

      if (!response.ok) {
        throw new Error("Unable to remove collaborator.");
      }

      await loadCollaborators();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove collaborator.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/editor/${projectId}`;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share {projectName}</DialogTitle>
          <DialogDescription>
            Invite collaborators and copy a link to this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 p-3">
            <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy link"}
              <Copy className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">Share a direct link with teammates.</p>
          </div>

          {isOwner ? (
            <form className="space-y-2" onSubmit={handleInvite}>
              <label className="text-sm font-medium" htmlFor="collaborator-email">
                Invite by email
              </label>
              <div className="flex gap-2">
                <Input
                  id="collaborator-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button type="submit" disabled={isSubmitting || !email.trim()}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
                </Button>
              </div>
            </form>
          ) : (
            <p className="rounded-lg border border-dashed border-border/70 p-3 text-sm text-muted-foreground">
              You can view collaborators but only the owner can add or remove access.
            </p>
          )}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Collaborators</h3>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            </div>

            {collaborators.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                No collaborators yet.
              </div>
            ) : (
              <ul className="space-y-2">
                {collaborators.map((collaborator) => (
                  <li
                    key={collaborator.email}
                    className="flex items-center justify-between rounded-lg border border-border/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {collaborator.avatarUrl ? (
                          <img
                            src={collaborator.avatarUrl}
                            alt={collaborator.displayName ?? collaborator.email}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <span>{collaborator.displayName?.slice(0, 2) ?? collaborator.email.slice(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {collaborator.displayName ?? collaborator.email}
                        </p>
                        {collaborator.displayName ? (
                          <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                        ) : null}
                      </div>
                    </div>
                    {isOwner ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemove(collaborator.email)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
