import { LogoLoader } from "@/components/ui/LogoLoader";

export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LogoLoader className="h-14 w-14" />
    </div>
  );
}
