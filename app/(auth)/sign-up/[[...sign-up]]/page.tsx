import { SignUp } from "@clerk/nextjs";
import { Ghost } from "lucide-react";

export default function Page() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col items-center justify-center border-r bg-muted p-10 md:flex">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <Ghost className="h-16 w-16" />
            <h1 className="mt-4 text-3xl font-bold">Ghost AI</h1>
            <p className="mt-2 text-muted-foreground">
              The intelligent coding companion.
            </p>
            <ul className="mt-8 space-y-2 text-left text-muted-foreground">
              <li>- AI-powered code generation</li>
              <li>- Seamless project scaffolding</li>
              <li>- Real-time collaboration</li>
              <li>- Intelligent debugging</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <SignUp />
      </div>
    </div>
  );
}
