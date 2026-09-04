import { LogoLoader } from "@/components/ui/LogoLoader";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LogoLoader className="h-14 w-14" />
    </div>
  );
}
