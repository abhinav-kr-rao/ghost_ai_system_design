
import { redirect } from "next/navigation";
import { AccessDenied } from "@/components/editor/access-denied";
import EditorShell from "@/components/editor/editor-shell";
import { getCurrentUserIdentity, getProjectAccess } from "@/lib/project-access";
import { getEditorHomeProjects } from "@/lib/projects";

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const { roomId } = await params;
  const identity = await getCurrentUserIdentity();

  if (!identity?.userId) {
    redirect("/sign-in");
  }

  const access = await getProjectAccess(roomId, identity);

  if (!access.project) {
    return <AccessDenied />;
  }

  const projects = await getEditorHomeProjects(identity.userId, identity.email);

  return (
    <div className="min-h-screen bg-background">
      <EditorShell
        project={{ id: access.project.id, name: access.project.name, ownerId: access.project.ownerId }}
        projects={projects}
        activeProjectId={access.project.id}
        isOwner={access.project.ownerId === identity.userId}
      />
    </div>
  );
}
