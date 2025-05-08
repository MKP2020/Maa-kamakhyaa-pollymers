import { log } from "console";

import { getAllQuantities } from "@/actions/quantity";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalQuantityStringObj } from "@/lib/utils";

export default async function page() {
  const quantities = await getAllQuantities();

  const filtered = quantities.sort((a, b) => {
    const aInGlobal = a.id in GlobalQuantityStringObj;
    const bInGlobal = b.id in GlobalQuantityStringObj;

    if (aInGlobal && !bInGlobal) return -1;
    if (!aInGlobal && bInGlobal) return 1;

    return a.id - b.id;
  });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-col-1 md:grid-cols-2 lg:grid-cols-3">
              {quantities.map((quantity) => {
                return (
                  <Card key={quantity.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {GlobalQuantityStringObj[quantity.id] ||
                          quantity.grade?.grade ||
                          ""}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-1 flex-row">
                        <div className="flex flex-1 flex-col">
                          <p className="text-2xl font-bold">
                            {quantity.producedQty}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Produced
                          </p>
                        </div>
                        <Separator orientation="vertical" className="h-full" />

                        <div className="flex flex-1 flex-col">
                          <p className="text-2xl font-bold">
                            {quantity.producedQty}
                          </p>

                          <p className="text-xs text-muted-foreground">Used</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
