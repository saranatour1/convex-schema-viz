import { ConvexSchemaViz } from "@/components/convex-schema-viz";
import { useSheetToggle } from "./stores";
import { useAtom } from "jotai";
import { Sheet } from "./components/ui/sheet";
import { NavBar } from "./components/NavBar";
import { CodeEditor } from "./components/CodeEditor";
import { Toaster } from "@/components/ui/sonner"

function App() {
  const [isActive, toggle] =useAtom(useSheetToggle)
  return (
    <main className="flex flex-col items-center justify-start min-h-screen max-w-full w-full h-full">
      <Sheet open={isActive} onOpenChange={toggle}>
        <NavBar />
        <CodeEditor />
      </Sheet>
        <ConvexSchemaViz />
        <Toaster position="bottom-left"/>
    </main>
  );
}

export default App;
