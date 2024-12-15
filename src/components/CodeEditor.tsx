import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { useAtom, useSetAtom } from "jotai";
import { schema, validatedSchemaObject } from "@/stores/schemaCode";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useEffect } from "react";

export const CodeEditor = () => {
  const [codeValue, setCodeValue] = useAtom(schema);
  const setCount = useSetAtom(validatedSchemaObject);
  const updateSchema = useAction(api.changes.view);

  useEffect(() => {
    updateSchema({ schemaObject: codeValue }).then((value) => {
      if (Array.isArray(value)) {
        value.forEach((error) => {
          toast.error(error.message);
        });
      } else {
        setCount(value);
      }
    });
  }, [codeValue]);

  return (
    <SheetContent className="!w-[20rem]">
      <SheetHeader>
        <SheetTitle>Schema code here</SheetTitle>
        <SheetDescription> Paste Your schema code here</SheetDescription>
      </SheetHeader>
      <div className="w-full h-full">
        <Editor
          className="h-full w-full max-h-[calc(100vh-40px)] py-10 !overflow-auto max-w-full"
          value={codeValue}
          onValueChange={(code) => setCodeValue(code)}
          highlight={(code) => highlight(code, languages.js, "typescript")}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            display: "block",
          }}
        />
      </div>
    </SheetContent>
  );
};
