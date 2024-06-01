"use client";
import { FC, useCallback, useEffect, useState } from "react";
import { Heading } from "../ui/heading";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Trash } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { SHIFT, cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { TInventoryFull } from "@/lib/schemas/inventory";
import { getInventoryBy } from "@/actions/inventory";
import type {
  TDepartment,
  TTTapeItemFull,
  TTapeConsumedItem,
  TTapeFull,
} from "@/lib/schemas";
import { TCategory } from "@/lib/schema";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { TGrade } from "@/lib/types";
import { createTapePlant } from "@/actions/tapePlant";

const formSchema = z.object({
  date: z.date(),

  shift: z.string(),

  tapeGrade: z.string().regex(/^\d+\.?\d*$/, "Please select a grade"),
  tapeQty: z.string().regex(/^\d+\.?\d*$/),
  tapeWaste: z
    .string()
    .regex(/^\d+\.?\d*$/)
    .nullish(),
  tapeLumps: z
    .string()
    .regex(/^\d+\.?\d*$/)
    .nullish(),

  consumedItems: z.array(
    z.object({
      rpType: z.string().regex(/^\d+\.?\d*$/, "Please select a type"),
      qty: z.string().regex(/^\d+\.?\d*$/),
    })
  ),

  items: z.array(
    z.object({
      itemId: z.string().regex(/^\d+\.?\d*$/),
      quantity: z
        .string()
        .min(1, "Please enter some quantity")
        .regex(/^\d+\.?\d*$/),

      categoryId: z.string().regex(/^\d+\.?\d*$/, "Please select a category"),
      departmentId: z
        .string()
        .regex(/^\d+\.?\d*$/, "Please select a department"),
      inventoryId: z.string().regex(/^\d+\.?\d*$/, "Please select a inventory"),
    })
  ),
});

type TCreateInventoryFormValues = z.infer<typeof formSchema>;

type TUnitFormItemProps = {
  form: UseFormReturn<TCreateInventoryFormValues>;
  departments: TDepartment[];
  categories: TCategory[];
  index: number;
  disabled: boolean;
  onPressRemove: () => void;
  initial?: TTTapeItemFull;
  isLast: boolean;
};

const UnitFormItem: FC<TUnitFormItemProps> = (props) => {
  const {
    form,
    disabled,
    initial,
    onPressRemove,
    departments,
    index,
    isLast,
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

        setItems(items as any);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedCategory, selectedDepartment]);

  const inventoryId = form.watch(`items.${index}.inventoryId`);

  const inventory = !!inventoryId
    ? items.find((item) => item.id === Number(inventoryId))
    : undefined;

  console.log(form.formState.errors);
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
          {...form.register(`items.${index}.quantity` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Used Quantity
                {disabled
                  ? ""
                  : !!inventory
                  ? ` (Available ${
                      inventory.inStockQuantity - inventory.usedQuantity
                    }${inventory.item.unit})`
                  : ""}
              </FormLabel>
              <FormControl inputMode="numeric">
                <Input
                  placeholder="Enter quantity"
                  {...field}
                  min={1}
                  max={
                    !!inventory
                      ? inventory.inStockQuantity - inventory.usedQuantity
                      : undefined
                  }
                  disabled={disabled}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!disabled ? (
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
      {!isLast ? <Separator className="mt-8" /> : null}
    </div>
  );
};

type TConsumedFormItemProps = {
  form: UseFormReturn<TCreateInventoryFormValues>;
  index: number;
  disabled: boolean;
  onPressRemove: () => void;
  initial?: TTapeConsumedItem;
  rpQuantities: Record<number, number>;
  selectedRpTypes: string[];
  isLast: boolean;
};

const revUnits: Record<number, string> = {
  35: "RP_Mix_1st",
  36: "RP_Mix_2nd",
  37: "RP_Black(Tape)_1st",
  38: "RP_Black(Lam)_1st",
  39: "RP_Black(Tape)_2nd",
  40: "RP_Black(Lam)_2nd",
};

const TYPES = ["35", "36", "37", "38", "39", "40"];

const units: Record<string, number> = {
  RP_Mix_1st: 35,
  RP_Mix_2nd: 36,
  "RP_Black(Tape)_1st": 37,
  "RP_Black(Lam)_1st": 38,
  "RP_Black(Tape)_2nd": 39,
  "RP_Black(Lam)_2nd": 40,
};

const ConsumedFormItem: FC<TConsumedFormItemProps> = (props) => {
  const {
    form,
    disabled,
    initial,
    selectedRpTypes,
    rpQuantities,
    onPressRemove,
    index,
    isLast,
  } = props;

  const type = form.watch(`consumedItems.${index}.rpType`);

  console.log("type", type);
  return (
    <div>
      <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-8 lg:space-y-0 ">
        <FormField
          {...form.register(`consumedItems.${index}.rpType` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>RP Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder="Select a type"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TYPES.map((item) => (
                    <SelectItem
                      disabled={selectedRpTypes.includes(item)}
                      key={item}
                      value={item}
                    >
                      {revUnits[Number(item)]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          {...form.register(`consumedItems.${index}.qty` as any)}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Used Quantity
                {disabled
                  ? ""
                  : type?.length > 0
                  ? `(Available ${rpQuantities[Number(type)]})`
                  : ""}
              </FormLabel>
              <FormControl inputMode="numeric">
                <Input
                  placeholder="Enter quantity"
                  {...field}
                  max={
                    type?.length > 0
                      ? rpQuantities[Number(type)] || 0
                      : undefined
                  }
                  disabled={disabled}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!disabled ? (
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
      {!isLast ? <Separator className="mt-8" /> : null}
    </div>
  );
};

export const CreateTapePlantForm: FC<
  Pick<TUnitFormItemProps, "categories" | "departments"> & {
    initialData?: TTapeFull;
    rpQuantities: Record<number, number>;
    grades: TGrade[];
  }
> = (props) => {
  const { categories, departments, grades, initialData, rpQuantities } = props;
  const title = !!initialData ? "View Tape Plant" : "Create Tape Plant";
  const description = !!initialData
    ? "view tape plant"
    : "Create a new tape plant";

  const [loading, setLoading] = useState(false);

  const action = initialData ? "Update" : "Add";

  const defaultValues: TCreateInventoryFormValues = !!initialData
    ? {
        shift: initialData.shift,
        tapeGrade: initialData.tapeGradeId.toString(),
        tapeQty: initialData.tapeQty.toString(),
        tapeWaste: initialData.tapeWaste.toString(),
        tapeLumps: initialData.tapeLumps.toString(),
        date: initialData.date,

        items: initialData.items.map((item) => ({
          categoryId: item.categoryId.toString(),
          departmentId: item.departmentId.toString(),
          itemId: item.itemId.toString(),
          inventoryId: item.inventoryId.toString(),
          quantity: item.quantity.toString(),
        })),
        consumedItems: initialData.consumedItems.map((item) => ({
          rpType: item.rpType.toString(),
          qty: item.qty.toString(),
        })),
      }
    : {
        shift: "",

        tapeGrade: "",
        tapeQty: "",
        tapeWaste: "",
        tapeLumps: "",
        date: new Date(),
        consumedItems: [],
        items: [],
      };

  const router = useRouter();
  const form = useForm<TCreateInventoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const {
    fields: consumedFields,
    append: consumedAppend,
    remove: consumedRemove,
  } = useFieldArray({
    control: form.control,
    name: "consumedItems",
  });

  const onSubmit = useCallback(async (data: TCreateInventoryFormValues) => {
    const {
      shift,
      tapeGrade,
      tapeQty,
      tapeWaste,
      tapeLumps,
      date,
      items,
      consumedItems,
    } = data;
    try {
      setLoading(true);
      // TODO: create
      await createTapePlant(
        {
          shift,
          tapeGradeId: Number(tapeGrade),
          tapeQty: Number(tapeQty),
          tapeWaste: tapeWaste?.length === 0 ? 0 : Number(tapeWaste),
          tapeLumps: tapeLumps?.length === 0 ? 0 : Number(tapeLumps),
          date,
        },
        items.map(
          ({ itemId, quantity, categoryId, departmentId, inventoryId }) => ({
            itemId: Number(itemId),
            quantity: Number(quantity),
            categoryId: Number(categoryId),
            departmentId: Number(departmentId),
            inventoryId: Number(inventoryId),
          })
        ),
        consumedItems.map((item) => ({
          rpType: Number(item.rpType),
          qty: Number(item.qty),
        }))
      );
      router.push(`/dashboard/tape-plant`);
      router.refresh();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const isDisabled = !!initialData;

  const selectedRpTypes = form
    .watch("consumedItems")
    .map((item) => item.rpType);
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setQuantityData(undefined);
  //       setIsGettingQuantity(true);
  //       // if (type === "3") {
  //       //   const data = await
  //       // } else {
  //       const data = await getQuantityDetails(getRpPreviousConsumedId(type));
  //       setQuantityData(data);
  //       // }
  //     } catch (error) {
  //     } finally {
  //       setIsGettingQuantity(false);
  //     }
  //   })();
  // }, [type]);

  return (
    <>
      {/* <AlertDialog open={open}>
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
          <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-8 lg:space-y-0 items-center">
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
                          disabled={isDisabled}
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

            <FormField
              control={form.control}
              name="shift"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Shift</FormLabel>
                  <Select
                    disabled={isDisabled}
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
          </div>
          <Separator className="my-2" />
          <h3>Items</h3>

          {fields.map((field, iIndex) => {
            return (
              <UnitFormItem
                isLast={fields.length === iIndex + 1}
                disabled={isDisabled}
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
              disabled={isDisabled}
              onClick={() => {
                append({
                  quantity: "",
                } as any);
              }}
              type="button"
              className="ml-auto"
            >
              Add Item
            </Button>
          ) : null}
          <Separator className="my-2" />
          <h3>Consumed RP Items</h3>

          {consumedFields.map((field, iIndex) => {
            return (
              <ConsumedFormItem
                isLast={consumedFields.length === iIndex + 1}
                selectedRpTypes={selectedRpTypes}
                disabled={isDisabled}
                initial={initialData?.consumedItems[iIndex]}
                onPressRemove={() => {
                  consumedRemove(iIndex);
                }}
                key={field.id}
                index={iIndex}
                form={form}
                rpQuantities={rpQuantities}
              />
            );
          })}
          {!initialData ? (
            <Button
              disabled={isDisabled}
              onClick={() => {
                consumedAppend({
                  quantity: "",
                } as any);
              }}
              type="button"
              className="ml-auto"
            >
              Add Item
            </Button>
          ) : null}
          <Separator className="my-2" />
          <h3>Tape Produced</h3>

          <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-8 lg:space-y-0 items-center">
            <FormField
              control={form.control}
              name="tapeGrade"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tape Grade</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a grade"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {grades.map((item) => (
                        <SelectItem
                          key={item.id.toString()}
                          value={item.id.toString()}
                        >
                          {item.grade}
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
              name="tapeQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produced Quantity (Num - Kg)</FormLabel>
                  <FormControl inputMode="numeric">
                    <Input
                      disabled={isDisabled}
                      placeholder="Enter quantity"
                      {...field}
                      min={0}
                      // disabled={disabled}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tapeWaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tape Waste (Num - Kg)</FormLabel>
                  <FormControl inputMode="numeric">
                    <Input
                      min={0}
                      disabled={isDisabled}
                      placeholder="Enter quantity"
                      {...field}
                      value={field.value || ""}
                      // disabled={disabled}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tapeLumps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tape Lumps</FormLabel>
                  <FormControl inputMode="numeric">
                    <Input
                      min={0}
                      disabled={isDisabled}
                      placeholder="Enter quantity"
                      {...field}
                      value={field.value || ""}
                      // disabled={disabled}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-2" />

          {!isDisabled ? (
            <Button
              disabled={loading || fields.length === 0}
              className="ml-auto"
              type="submit"
            >
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
