import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="my-20 flex items-center justify-center">
      <Loader2 className="w-16 h-16 animate-spin text-foreground" />
    </div>
  );
}
