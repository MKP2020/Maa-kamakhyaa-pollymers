import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { currentUser } from '@clerk/nextjs/server';

import { ScrollArea } from '../ui/scroll-area';

export default async function Sidebar() {
  const user = await currentUser();
  const role = user?.publicMetadata.role as number;

  if (role === undefined) return null;

  return (
    <nav className="relative hidden h-screen border-r pt-16 lg:flex w-72">
      <ScrollArea className="h-full flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                Overview
              </h2>
              <DashboardNav
                items={navItems.filter((item) => item.access.includes(role))}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </nav>
  );
}
