import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function page() {
  return (
    <ScrollArea className="h-full ">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4 px-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-col-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Card key={item}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-3 w-[250px]" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-1 flex-row">
                    <div className="flex flex-1 flex-col">
                      <Skeleton className="h-6 w-1/3" />

                      <p className="text-xs text-muted-foreground">Produced</p>
                    </div>
                    <Separator orientation="vertical" className="h-full" />

                    <div className="flex flex-1 flex-col">
                      <Skeleton className="h-6 w-1/3" />

                      <p className="text-xs text-muted-foreground">Used</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </ScrollArea>
  );
}
