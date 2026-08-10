
import { redirect } from "next/navigation";
import { AccessDenied } from "@/components/editor/access-denied";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
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
      <EditorNavbar
        isOpen={true}
        setIsOpen={() => {}}
        projectName={access.project.name}
        shareAction={
          <ShareDialog
            projectId={access.project.id}
            projectName={access.project.name}
            isOwner={access.project.ownerId === identity.userId}
          />
        }
      />
      <ProjectSidebar
        isOpen={true}
        onClose={() => {}}
        ownedProjects={projects.ownedProjects}
        sharedProjects={projects.sharedProjects}
        activeProjectId={access.project.id}
        showBackdrop={false}
      />
      <main className="flex min-h-screen items-center justify-center bg-[#0f1115] px-6 py-24 pl-80 pr-80 pt-24 text-center">
        <div className="flex w-full max-w-3xl items-center justify-center rounded-xl border border-white/10 bg-[#161a22] p-8 shadow-2xl">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Workspace Preview
            </p>
            <h1 className="mb-3 text-3xl font-semibold text-white">
              {access.project.name}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              The collaborative canvas shell is ready. The next step will add the interactive editor surface and AI panel.
            </p>
          </div>
        </div>
        <aside className="fixed right-0 top-16 hidden h-[calc(100vh-4rem)] w-80 border-l border-white/10 bg-[#11141a] p-6 lg:flex lg:flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              AI Assistant
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-muted-foreground">
            AI chat panel coming soon.
          </div>
        </aside>
      </main>
    </div>
  );
}
