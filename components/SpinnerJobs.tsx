import { Loader2 } from "lucide-react";

export default function SpinnerJobs() {
  return (
    <div className="my-12 flex flex-col items-center gap-2 justify-center">
      <Loader2 className="w-16 h-16 animate-spin text-foreground" />
      <p className="text-muted-foreground text-sm">Loading jobs</p>
    </div>
  );
}
