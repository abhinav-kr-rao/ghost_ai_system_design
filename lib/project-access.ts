import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export interface CurrentUserIdentity {
  userId: string;
  email: string | null;
}

export interface ProjectAccessResult {
  project: {
    id: string;
    name: string;
    ownerId: string;
  } | null;
}

export async function getCurrentUserIdentity(): Promise<CurrentUserIdentity | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? null;

  return {
    userId,
    email: primaryEmail,
  };
}

export async function getProjectAccess(
  projectId: string,
  identity: CurrentUserIdentity | null,
): Promise<ProjectAccessResult> {
  if (!identity?.userId) {
    return { project: null };
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!project) {
    return { project: null };
  }

  const normalizedEmail = identity.email?.toLowerCase() ?? null;
  const hasAccess =
    project.ownerId === identity.userId ||
    (normalizedEmail !== null &&
      project.collaborators.some((collaborator) =>
        collaborator.email.toLowerCase() === normalizedEmail,
      ));

  if (!hasAccess) {
    return { project: null };
  }

  return {
    project: {
      id: project.id,
      name: project.name,
      ownerId: project.ownerId,
    },
  };
}
