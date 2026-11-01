// Deterministic color mapping for user cursors
const CURSOR_COLORS = [
  "#E55854", // Red
  "#F7A644", // Orange
  "#F1D74E", // Yellow
  "#7BC67B", // Green
  "#5DADE2", // Blue
  "#9B59B6", // Purple
  "#E74C3C", // Crimson
  "#16A085", // Teal
];

export function getUserCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index];
}

/**
 * Get or create a Liveblocks room via REST API
 */
export async function getOrCreateLiveblocksRoom(roomId: string) {
  const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secretKey) {
    throw new Error("LIVEBLOCKS_SECRET_KEY environment variable is required");
  }

  const response = await fetch(
    "https://api.liveblocks.io/v2/rooms?idempotent=true",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roomId,
        defaultAccesses: [],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to create room: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Generate a Liveblocks access token for one authorized room.
 */
export async function generateLiveblocksToken(
  userId: string,
  roomId: string,
  userInfo: {
    name: string;
    avatar: string;
    cursorColor: string;
  },
) {
  const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secretKey) {
    throw new Error("LIVEBLOCKS_SECRET_KEY environment variable is required");
  }

  const response = await fetch("https://api.liveblocks.io/v2/authorize-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      userInfo,
      permissions: {
        [roomId]: ["*:write"],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}
