"use client";
import type {
  TGRNFull,
  TPurchaseOrder,
  TPurchaseOrderItemFull,
} from "@/lib/types";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { SHIFT, cn, getGRNNumber } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Trash } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { getPurchaseOrderItems } from "@/actions/purchaseOrder";
import { createGrn } from "@/actions/grn";
import type {
  TCategory,
  TDepartment,
  TInventory,
  TInventoryFull,
  TWashingUnitFull,
  TWashingUnitItemFull,
} from "@/lib/schema";
import { getInventory, getInventoryBy } from "@/actions/inventory";
import { Textarea } from "../ui/textarea";
import { createWashingUnit, updateWashingUnit } from "@/actions/washingUnit";

type TCreateWashingUnit = {
  initialData?: TWashingUnitFull;
  categories: TCategory[];
  departments: TDepartment[];
};

const formSchema = z.object({
  date: z.date(),

  note: z.string().nullable(),
  items: z.array(
    z.object({
      categoryId: z.string().regex(/^\d+\.?\d*$/, "Please select a category"),
      departmentId: z
        .string()
        .regex(/^\d+\.?\d*$/, "Please select a department"),
      itemId: z.string().regex(/^\d+\.?\d*$/, "Please select a department"),

      inventoryId: z
        .string()
        .regex(/^\d+\.?\d*$/, "Please select an inventory"),
      reqQuantity: z
        .string()
        .regex(/^\d+\.?\d*$/, "Please enter request quantity"),
      issueQuantity: z
        .string()
        .regex(/^\d+\.?\d*$/, "Please enter issue quantity"),
    })
  ),
  shift: z.string().default(""),
  bhusaQuantity: z
    .string()
    .regex(/^\d+\.?\d*$/, "Please select an inventory")
    .default("")
    .nullable(),
});

type NewGRNFormValues = z.infer<typeof formSchema>;

type TUnitFormItemProps = {
  form: UseFormReturn<NewGRNFormValues>;
  departments: TDepartment[];
  categories: TCategory[];
  index: number;
  disabled: boolean;
  onPressRemove: () => void;
  initial?: TWashingUnitItemFull;
};

const UnitFormItem: FC<TUnitFormItemProps> = (props) => {
  const {
    form,
    disabled,
    initial,
    onPressRemove,
    departments,
    index,
    categories,
  } = props;

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    initial?.categoryId
  );

  const [selectedDepartment, setSelectedDepartment] = useState<
    number | undefined
  >(initial?.departmentId);

  const [isLoading, setIsLoading] = useState(false);

  const [items, setItems] = useState<TInventoryFull[]>([]);

  useEffect(() => {
    if (!selectedCategory || !selectedDepartment) return;

    (async () => {
      try {
        setIsLoading(true);
        const items = await getInventoryBy(
          selectedCategory,
          selectedDepartment
        );

        console.log("items", items);
        setItems(items as any);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedCategory, selectedDepartment]);
  return (
    <div>
      <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-8 lg:space-y-0 ">
        <FormField
          {...form.register(`items.${index}.categoryId` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Id</FormLabel>
              <Select
                onValueChange={(e) => {
                  setSelectedCategory(Number(e));
                  field.onChange(e);
                }}
                value={field.value}
                defaultValue={field.value}
                disabled={disabled}
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
                  {(initial ? [initial.category] : categories).map(
                    (category) => (
                      <SelectItem
                        key={category.id.toString()}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          {...form.register(`items.${index}.departmentId` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select
                onValueChange={(e) => {
                  setSelectedDepartment(Number(e));
                  field.onChange(e);
                }}
                value={field.value}
                defaultValue={field.value}
                disabled={disabled}
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
                  {(initial ? [initial.department] : departments).map(
                    (department) => (
                      <SelectItem
                        key={department.id.toString()}
                        value={department.id.toString()}
                      >
                        {department.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          {...form.register(`items.${index}.inventoryId` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory Item</FormLabel>
              <Select
                disabled={disabled}
                onValueChange={(e) => {
                  form.setValue(
                    `items.${index}.itemId`,
                    (items || [])[index].itemId.toString()
                  );
                  field.onChange(e);
                }}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder={
                        isLoading ? "Loading items" : "Select an item"
                      }
                    />
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!selectedCategory ? (
                    <span className="text-sm">Select a category first</span>
                  ) : !selectedDepartment ? (
                    <span className="text-sm">Select a department first</span>
                  ) : items.length === 0 ? (
                    <span className="text-sm">
                      No items in selected category and department
                    </span>
                  ) : (
                    (items || []).map((item) => (
                      <SelectItem
                        key={item.id.toString()}
                        value={item.id.toString()}
                      >
                        {item.item.name}
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
          {...form.register(`items.${index}.reqQuantity` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requested Quantity</FormLabel>
              <FormControl inputMode="numeric">
                <Input
                  placeholder="Enter quantity"
                  {...field}
                  disabled={disabled}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          {...form.register(`items.${index}.issueQuantity` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issued Quantity</FormLabel>
              <FormControl inputMode="numeric">
                <Input
                  placeholder="Enter quantity"
                  {...field}
                  disabled={disabled}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {index !== 0 ? (
          <div className="flex flex-col h-full items-start justify-end">
            <Button
              disabled={disabled}
              variant="destructive"
              onClick={onPressRemove}
              type="button"
            >
              <Trash className="mr-2 h-4 w-4" /> Remove
            </Button>
          </div>
        ) : null}
      </div>
      <Separator className="mt-8" />
    </div>
  );
};
export const CreateWashingUnit: FC<TCreateWashingUnit> = (props) => {
  const { initialData, departments, categories } = props;
  const title = initialData ? "View Washing Unit" : "Create Consumption";
  const description = initialData
    ? "View Washing Unit."
    : "Add a new Consumption";
  const toastMessage = initialData
    ? "Bhusha production added."
    : "Consumption created.";
  const action = initialData ? "Update Bhusa Produced" : "Add Consumption";

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isUpdate = !!initialData;
  const defaultValues: NewGRNFormValues = !!initialData
    ? ({
        date: initialData.date,
        note: initialData.note,
        shift: initialData.shift,
        bhusaQuantity: initialData.bhusaQuantity?.toString(),
        items: initialData.items.map((item) => ({
          categoryId: item.categoryId.toString(),
          departmentId: item.departmentId.toString(),
          itemId: item.itemId.toString(),
          inventoryId: item.inventoryId.toString(),
          reqQuantity: item.reqQty.toString(),
          issueQuantity: item.issueQuantity.toString(),
        })),
      } as any)
    : { date: "", note: "", shift: "", bhusaQuantity: "" };

  const form = useForm<NewGRNFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isDisabled = !!initialData || loading;
  const onSubmit = useCallback(
    async (data: NewGRNFormValues) => {
      const {} = data;
      try {
        setLoading(true);

        if (!initialData) {
          await createWashingUnit(
            {
              shift: data.shift,
              note: data.note,
              date: data.date,
              bhusaQuantity: Number(data.bhusaQuantity),
            },
            data.items.map((item) => ({
              inventoryId: Number(item.inventoryId),
              departmentId: Number(item.departmentId),
              categoryId: Number(item.categoryId),
              issueQuantity: Number(item.issueQuantity),
              reqQty: Number(item.reqQuantity),
              itemId: Number(item.itemId),
            }))
          );
        } else {
          await updateWashingUnit(
            initialData.id,
            data.note || undefined,
            data.shift,
            Number(data.bhusaQuantity)
          );
        }
        router.push(`/dashboard/washing-unit`);
        router.refresh();

        toast({
          title: toastMessage,
          description: !initialData
            ? "Washing Unit successfully created"
            : "Bhusha production successfully updated",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            (error as any).message || "There was a problem with your request.",
        });
      } finally {
        setLoading(false);
      }
    },
    [initialData]
  );

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const values = form.getValues();

  const total = useMemo(() => {
    let total = 0;

    // const totalTax = (total * tacPercentageNumber) / 100;

    return (total + 0).toString();
  }, [values]);

  const canUpdate = !initialData?.shift || !initialData?.bhusaQuantity;
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8 space-y-8 lg:space-y-0 items-center">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger disabled={isDisabled} asChild>
                      <FormControl>
                        <Button
                          disabled={isUpdate}
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
          <h3>Items</h3>

          {fields.map((field, iIndex) => {
            return (
              <UnitFormItem
                disabled={isUpdate}
                initial={initialData?.items[iIndex]}
                onPressRemove={() => {
                  remove(iIndex);
                }}
                key={field.id}
                index={iIndex}
                form={form}
                categories={categories}
                departments={departments}
              />
            );
          })}
          {!initialData ? (
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

          <FormField
            disabled={!canUpdate}
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Enter note here"
                    {...(field as any)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="my-2" />
          <h3>Bhusa Production</h3>
          <div className="md:grid grid-cols-1 items-center md:grid-cols-2 gap-8 space-y-8 lg:space-y-0 items-center">
            <FormField
              control={form.control}
              name="shift"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Shift</FormLabel>
                  <Select
                    disabled={!canUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a shift"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SHIFT.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={!canUpdate}
              control={form.control}
              name="bhusaQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bhusa Produced</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter used quantity"
                      {...(field as any)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {canUpdate ? (
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
