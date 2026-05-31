import { SignIn } from "@clerk/nextjs";
import { Ghost } from "lucide-react";

export default function Page() {
  return (
      <div className="flex items-center justify-center">
        <SignIn />
      </div>
  
  );
}
