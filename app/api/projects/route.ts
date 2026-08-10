import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  id: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parsed = createProjectSchema.safeParse(
      await req.json().catch(() => ({})),
    );

    if (!parsed.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const body = parsed.data;

    // If the client supplied an `id`, treat the request as idempotent: if a
    // project with that id already exists return it instead of attempting a
    // duplicate create. This helps callers recover when the create succeeded
    // but the response failed to reach the client.
    if (body.id) {
      const existing = await prisma.project.findUnique({ where: { id: body.id } });

      if (existing) {
        return NextResponse.json(existing);
      }
    }

    const project = await prisma.project.create({
      data: {
        id: body.id,
        name: body.name ?? "Untitled Project",
        ownerId: userId,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}