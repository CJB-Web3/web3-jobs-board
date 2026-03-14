// import Spinner from "@/app/_components/Spinner";
import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-16 h-16 animate-spin text-foreground" />
    </div>
  );
}

export default Loading;
