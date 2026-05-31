export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-muted/30 border-r border-border">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 bg-primary rounded-md"></div>
            <span className="font-bold text-xl">Ghost AI</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Build faster with context.</h1>
          <p className="text-muted-foreground mb-12">
            Your AI-powered workspace out of the box.
          </p>

          <ul className="space-y-4 text-sm text-foreground">
            <li className="flex items-center gap-2">
              ✓ Context-aware completions
            </li>
            <li className="flex items-center gap-2">
              ✓ Autonomous task execution
            </li>
            <li className="flex items-center gap-2">
              ✓ Seamless integration
            </li>
          </ul>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ghost AI. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
