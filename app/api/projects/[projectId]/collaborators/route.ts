import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

const collaboratorSchema = z.object({
  email: z.string().trim().email(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
        collaborators: {
          select: {
            email: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const currentUserRecord = await currentUser();
    const signedInEmail = currentUserRecord?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;

    const hasAccess =
      project.ownerId === userId ||
      (signedInEmail !== null &&
        project.collaborators.some(
          (collaborator) => collaborator.email.toLowerCase() === signedInEmail,
        ));

    if (!hasAccess) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const collaboratorEmails = project.collaborators.map((collaborator) => collaborator.email);
    const clerk = await clerkClient();
    const clerkUsers = await clerk.users.getUserList({ limit: 100 });

    const usersByEmail = new Map<string, { firstName: string | null; lastName: string | null; imageUrl: string | null }>();

    for (const user of clerkUsers.data) {
      const matchingEmail = user.emailAddresses.find((email) => {
        const normalizedEmail = email.emailAddress.toLowerCase();
        return collaboratorEmails.some((candidate) => candidate.toLowerCase() === normalizedEmail);
      });

      if (matchingEmail) {
        usersByEmail.set(matchingEmail.emailAddress.toLowerCase(), {
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      }
    }

    const collaborators = collaboratorEmails.map((email) => {
      const clerkUser = usersByEmail.get(email.toLowerCase());
      const displayName = clerkUser
        ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null
        : null;

      return {
        email,
        displayName,
        avatarUrl: clerkUser?.imageUrl ?? null,
      };
    });

    return NextResponse.json({ collaborators });
  } catch (error) {
    console.error("[COLLABORATORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (project.ownerId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = collaboratorSchema.safeParse(await req.json().catch(() => ({})));

    if (!body.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const existingCollaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_email: {
          projectId,
          email: body.data.email.toLowerCase(),
        },
      },
    });

    if (existingCollaborator) {
      return new NextResponse("Collaborator already exists", { status: 409 });
    }

    try {
      const collaborator = await prisma.projectCollaborator.create({
        data: {
          projectId,
          email: body.data.email.toLowerCase(),
        },
      }); return NextResponse.json(collaborator);
    } catch (createError) {
      if (
        createError instanceof Prisma.PrismaClientKnownRequestError &&
        createError.code === "P2002"
      ) {
        return new NextResponse("Collaborator already exists", { status: 409 });
      } throw createError;
    }
  } catch (error) {
    console.error("[COLLABORATORS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (project.ownerId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = collaboratorSchema.safeParse(await req.json().catch(() => ({})));

    if (!body.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const collaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_email: {
          projectId,
          email: body.data.email.toLowerCase(),
        },
      },
    });

    if (!collaborator) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.projectCollaborator.delete({
      where: {
        id: collaborator.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[COLLABORATORS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
