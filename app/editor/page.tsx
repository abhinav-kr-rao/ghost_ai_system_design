import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EditorHome } from "@/components/editor/editor-home";
import { getEditorHomeProjects } from "@/lib/projects";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? null;
  const projects = await getEditorHomeProjects(userId, userEmail);

  return <EditorHome projects={projects} />;
}