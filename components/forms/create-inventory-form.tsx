"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { useToast } from "../ui/use-toast";
import { type TDepartment } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { TInventoryFull } from "@/lib/schemas";
import { TCategory, TTableList, TTableListFull } from "@/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createInventory } from "@/actions/inventory";
import { getTableListByCategory } from "@/actions/table-list";

export const IMG_MAX_LIMIT = 3;

const formSchema = z
  .object({
    categoryId: z.string().regex(/^\d+\.?\d*$/, "Please select a category"),
    departmentId: z.string().regex(/^\d+\.?\d*$/, "Please select a department"),
    itemId: z.string().regex(/^\d+\.?\d*$/, "Please select an item"),
    inStockQuantity: z
      .string()
      .regex(/^\d+\.?\d*$/, "Please enter a valid quantity"),
    usedQuantity: z
      .string()
      .regex(/^\d+\.?\d*$/, "Please enter a valid quantity"),
  })
  .refine(
    ({ inStockQuantity, usedQuantity }) => {
      return inStockQuantity.length === 0
        ? false
        : Number(inStockQuantity) >= Number(usedQuantity);
    },
    {
      message: "used quantity is more than entered in-stock quantity",
      path: ["usedQuantity"],
    }
  );

type TCreateInventoryFormValues = z.infer<typeof formSchema>;

interface TCreateInventoryFormProps {
  initialData?: TInventoryFull;
  departments: TDepartment[];
  categories: TCategory[];
}

export const CreateInventoryForm: React.FC<TCreateInventoryFormProps> = ({
  initialData,
  categories,
  departments,
}) => {
  const isUpdate = true;

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();

  const [isGettingItems, setIsGettingItems] = useState(false);
  const [items, setItems] = useState<TTableList[]>(
    !!initialData ? [initialData.item] : []
  );

  const title = initialData ? "Edit Inventory" : "Create Inventory";
  const description = initialData
    ? "Edit inventory details."
    : "Add a new inventory item";
  const toastMessage = initialData
    ? "Inventory updated."
    : "Inventory created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues: TCreateInventoryFormValues = initialData
    ? {
        itemId: initialData.item.id.toString(),
        departmentId: initialData.departmentId.toString(),
        categoryId: initialData.categoryId.toString(),
        inStockQuantity: initialData.inStockQuantity.toString(),
        usedQuantity: initialData.usedQuantity.toString(),
      }
    : {
        itemId: "",
        departmentId: "",
        categoryId: "",
        inStockQuantity: "",
        usedQuantity: "",
      };

  const form = useForm<TCreateInventoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (selectedCategory === undefined || isUpdate) return;

    (async () => {
      try {
        setIsGettingItems(true);
        const response = await getTableListByCategory(Number(selectedCategory));
        setItems(response);
      } catch (err) {
      } finally {
        setIsGettingItems(false);
      }
    })();
  }, [selectedCategory, isUpdate]);

  const onSubmit = async (data: TCreateInventoryFormValues) => {
    try {
      setLoading(true);
      if (!!initialData) {
        // await updateDepartment(initialData.id, data.name);
      } else {
        // await createInventory({
        //   itemId: Number(data.itemId),
        //   categoryId: Number(data.categoryId),
        //   inStockQuantity: Number(data.inStockQuantity),
        //   usedQuantity: Number(data.usedQuantity),
        //   departmentId: Number(data.departmentId),
        // });
      }
      router.push(`/dashboard/inventory`);
      router.refresh();
      toast({
        title: "Success!",
        description: toastMessage,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // setOpen(false);
                // await deleteDepartment(initialData!.id);
                // router.push("/dashboard/inventory");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading || isUpdate}
                    onValueChange={(e) => {
                      setSelectedCategory(e);
                      field.onChange(e);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading || isUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a department"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem
                          key={department.id}
                          value={department.id.toString()}
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Select
                    disabled={loading || isUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select an item"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inStockQuantity"
              render={({ field }) => (
                <FormItem inputMode="numeric">
                  <FormLabel>In-Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdate}
                      type="number"
                      placeholder="Enter in-stock quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="usedQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Used Quantity</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isUpdate}
                      type="number"
                      placeholder="Enter used quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!isUpdate ? (
            <Button disabled={loading} className="ml-auto" type="submit">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {action}
            </Button>
          ) : null}
        </form>
      </Form>
    </>
  );
};
