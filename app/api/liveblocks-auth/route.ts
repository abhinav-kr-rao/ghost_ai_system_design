import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  getUserCursorColor,
  getOrCreateLiveblocksRoom,
  generateLiveblocksToken,
} from "@/lib/liveblocks";
import { getCurrentUserIdentity, getProjectAccess } from "@/lib/project-access";

export async function POST(request: NextRequest) {
  try {
    // 1. Require Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const identity = await getCurrentUserIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body for project ID (room name)
    const body = await request.json();
    const { room } = body;
    const projectId = room;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // 2. Verify project access using the existing access helper
    const accessResult = await getProjectAccess(projectId, identity);
    if (!accessResult.project) {
      return NextResponse.json(
        { error: "forbidden", reason: "Access denied" },
        { status: 403 }
      );
    }

    // 3. Ensure the Liveblocks room exists (create only if needed)
    const user = await currentUser();
    const userName = user?.fullName ?? user?.firstName ?? "Anonymous";
    const userAvatar =
      user?.imageUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

    console.log("Inside post --------------------");
    

    await getOrCreateLiveblocksRoom(projectId);

    // 4. Generate and return a session token with user name, avatar, and cursor color
    const token = await generateLiveblocksToken(identity.userId, projectId, {
      name: userName,
      avatar: userAvatar,
      cursorColor: getUserCursorColor(identity.userId),
    });

    console.log("------------------token is \n\n",token);
    

    return NextResponse.json({
      token,
    });
  } catch (error) {
    console.error("Error in liveblocks-auth:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
