import { BookOpenIcon } from "lucide-react";
import { SheetTrigger } from "./ui/sheet";

export const NavBar = () => {
  return (
    <nav className="h-8 flex items-center justify-start w-full px-4">
      <SheetTrigger asChild>
        <button className="text-md font-thin text-gray-900 bg-white shadow-sm border bg-transparent" title="open code Editor">
          <span className="sr-only"> open code editor on the side </span>
          <BookOpenIcon size={16}/>
        </button>
      </SheetTrigger>
    </nav>
  );
};
