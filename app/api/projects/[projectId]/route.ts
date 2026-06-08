import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (project.ownerId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json().catch(() => ({}));

    // Only allow renaming based on requirements
    if (typeof body.name !== "string" || !body.name.trim()) {
      return new NextResponse("Invalid name", { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: body.name.trim(),
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("[PROJECT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { projectId } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (project.ownerId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const deletedProject = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json(deletedProject);
  } catch (error) {
    console.error("[PROJECT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}