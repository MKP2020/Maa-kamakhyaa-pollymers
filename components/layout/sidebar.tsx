import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export default function Sidebar() {
  return (
    <nav className={cn(`relative hidden h-screen border-r pt-16 lg:flex w-72`)}>
      <ScrollArea className="h-full flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                Overview
              </h2>
              <DashboardNav items={navItems} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </nav>
  );
}
