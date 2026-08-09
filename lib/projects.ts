import prisma from "@/lib/prisma";

export interface EditorProjectSummary {
  id: string;
  name: string;
  isShared: boolean;
}

export interface EditorHomeProjects {
  ownedProjects: EditorProjectSummary[];
  sharedProjects: EditorProjectSummary[];
}

export async function getEditorHomeProjects(
  userId: string,
  userEmail: string | null,
): Promise<EditorHomeProjects> {
  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    userEmail
      ? prisma.project.findMany({
          where: {
            ownerId: {
              not: userId,
            },
            collaborators: {
              some: {
                email: {
                  equals: userEmail,
                  mode: "insensitive",
                },
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : Promise.resolve([]),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) => ({
      ...project,
      isShared: false,
    })),
    sharedProjects: sharedProjects.map((project) => ({
      ...project,
      isShared: true,
    })),
  };
}