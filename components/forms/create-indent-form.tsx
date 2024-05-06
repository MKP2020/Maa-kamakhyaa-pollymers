"use client";
import { useEffect, useState } from "react";
import { CalendarIcon, Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TCategory } from "@/lib/schema";
import { useToast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { TDepartment, TIndent, TTableList } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn, getIndentNumber } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { createIndent, updateIndentApprovedQuantities } from "@/actions/indent";
import { getTableListByCategory } from "@/actions/table-list";

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  date: z.date(),
  departmentId: z.string().regex(/^\d+\.?\d*$/),
  categoryId: z.string().regex(/^\d+\.?\d*$/),

  items: z.array(
    z
      .object({
        itemId: z.string().regex(/^\d+\.?\d*$/),
        indentedQty: z
          .string()
          .min(1)
          .regex(/^\d+\.?\d*$/),
        approvedQty: z.string(),
      })
      .refine(
        ({ approvedQty, indentedQty }) => {
          return approvedQty.length === 0
            ? true
            : Number(approvedQty) <= Number(indentedQty);
        },
        {
          message: "Approved quantity is more than entered indented quantity",
          path: ["approvedQty"],
        }
      )
  ),
});

type NewIndentFormValues = z.infer<typeof formSchema>;

interface IndentFormProps {
  initialData?: TIndent;
  departments: TDepartment[];
  categories: TCategory[];
}

type TItem = z.infer<typeof formSchema>["items"][number];

export const CreateIndentForm: React.FC<IndentFormProps> = ({
  initialData,
  categories,
  departments,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit Indent" : "Create New Indent";
  const description = initialData ? "Edit indent details." : "Add a new indent";
  const toastMessage = initialData ? "Indent updated." : "Indent created.";
  const action = initialData ? "Save changes" : "Create";

  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const [items, setItems] = useState<TTableList[]>([]);

  const defaultValues: typeof formSchema._type = !!initialData
    ? ({
        date: initialData.date,
        departmentId: initialData.departmentId.toString(),
        categoryId: initialData.categoryId.toString(),
        items: initialData.items.map((item) => ({
          itemId: item.itemId.toString(),
          indentedQty: item.indentedQty.toString(),
          approvedQty: item.approvedQty?.toString() || "",
        })),
      } as any)
    : {
        date: "",
        departmentId: "",
        categoryId: "",
        items: [{ indentedQty: "", approvedQty: "", itemId: "" } as any] as any,
      };

  const form = useForm<NewIndentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    initialData?.categoryId
  );

  useEffect(() => {
    // if (!!initialData) return;

    if (!selectedCategory) return;
    setItems([]);
    (async () => {
      try {
        for (let index = 0; index < fields.length; index++) {
          form.setValue(`items.${index}.itemId`, "");
        }
        setIsLoadingItems(true);
        const data = await getTableListByCategory(Number(selectedCategory));
        if (data.length > 0) {
          setItems(data);
        } else {
          setItems([]);
        }
      } catch (error) {
        alert("invalid category id");
        setItems([]);
      } finally {
        setIsLoadingItems(false);
      }
    })();
  }, [selectedCategory]);

  const isUpdate = !!initialData;

  const canUpdate = !initialData
    ? true
    : initialData.items.some((item) => !item.approvedQty);

  const onSubmit = async (data: NewIndentFormValues) => {
    try {
      setLoading(true);
      if (!initialData) {
        await createIndent(
          {
            ...data,
            departmentId: Number(data.departmentId),
            categoryId: Number(data.categoryId),
            indentNumber: getIndentNumber(data.date),
          },
          data.items.map((item) => {
            const data = {
              itemId: Number(item.itemId),
              indentedQty: Number(item.indentedQty),
            } as any;

            if (
              item.approvedQty.length !== 0 &&
              !isNaN(Number(item.approvedQty))
            ) {
              data.approvedQty = Number(item.approvedQty);
            }

            return data;
          })
        );
      } else {
        await updateIndentApprovedQuantities(
          data.items.map((item, index) => ({
            id: initialData.items[index].id,
            approvedQty:
              item.approvedQty.length === 0 ? null : Number(item.approvedQty),
          }))
        );
      }
      router.push(`/dashboard/indent`);
      router.refresh();

      toast({
        title: toastMessage,
        description: !initialData
          ? "Indent successfully created"
          : "Indent successfully updated",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              indent
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
                setOpen(false);
                // TODO: delete
                await deleteVendor(initialData!.id);
                router.push("/dashboard/vendor");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )} */}
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
                      field.onChange(e);
                      setSelectedCategory(Number(e));
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
                  <FormLabel>Department</FormLabel>
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
                          placeholder="Select a category"
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Indent Date</FormLabel>
                  <Popover>
                    <PopoverTrigger disabled={loading || isUpdate} asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-2" />
          <h3>Indent Items</h3>
          {fields.map((item, index) => {
            return (
              <div key={index}>
                <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FormField
                    {...form.register(`items.${index}.itemId` as any)}
                    defaultValue={item.itemId}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>

                        <Select
                          disabled={isLoadingItems || loading || isUpdate}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select an Item"
                              />
                              {isLoadingItems ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {items.length === 0 ? (
                              <span className="text-sm">No items found</span>
                            ) : (
                              items.map((tITem) => (
                                <SelectItem
                                  key={tITem.id.toString()}
                                  value={tITem.id.toString()}
                                >
                                  {tITem.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    {...form.register(`items.${index}.indentedQty` as any)}
                    defaultValue={item.indentedQty}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem inputMode="numeric">
                        <FormLabel>Indented Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Indented Quantity"
                            {...field}
                            disabled={loading || isUpdate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    {...form.register(`items.${index}.approvedQty` as any)}
                    defaultValue={item.approvedQty}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem inputMode="numeric">
                        <FormLabel>Approved Quantity</FormLabel>
                        <FormControl>
                          <Input
                            disabled={!canUpdate}
                            type="number"
                            placeholder="Enter Approved Quantity"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isUpdate ? null : index !== 0 ? (
                    <div className="flex flex-col h-full items-start justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => remove(index)}
                        type="button"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  ) : null}
                </div>
                {fields.length !== index + 1 ? (
                  <Separator className="mt-8" />
                ) : null}
              </div>
            );
          })}
          {!isUpdate ? (
            <Button
              onClick={() => {
                append({
                  approvedQty: "",
                  indentedQty: "",
                } as any);
              }}
              type="button"
              className="ml-auto"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add Item
            </Button>
          ) : null}
          <Separator className="my-2" />
          {canUpdate ? (
            <div className="flex items-end">
              <Button disabled={loading} className="ml-auto" type="submit">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {action}
              </Button>
            </div>
          ) : null}
        </form>
      </Form>
    </>
  );
};
