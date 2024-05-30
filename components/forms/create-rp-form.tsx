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
import { RP_TYPE, SHIFT, cn, getRpPreviousConsumedId } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TInventoryFull } from "@/lib/schemas/inventory";
import { getInventoryBy } from "@/actions/inventory";
import {
  TDepartment,
  TQuantity,
  TRpFull,
  TRpItemFull,
  TWashingUnitItemFull,
} from "@/lib/schemas";
import { TCategory } from "@/lib/schema";
import { Input } from "../ui/input";
import { getQuantityDetails } from "@/actions/quantity";
import { createRp } from "@/actions/rp";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    date: z.date(),

    shift: z.string(),
    type: z.string().regex(/^\d+\.?\d*$/, "Please select a type"),
    consumedQty: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .nullish(),
    producedQty: z.string().regex(/^\d+\.?\d*$/),

    loomQty: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .nullish(),
    lamQty: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .nullish(),
    tapeQty: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .nullish(),
    tarpQty: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .nullish(),

    rpLumps: z
      .string()
      .regex(/^\d+\.?\d*$/)
      .nullable(),

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
        inventoryId: z
          .string()
          .regex(/^\d+\.?\d*$/, "Please select a inventory"),
      })
    ),
  })
  .refine(
    ({ type, consumedQty }) => {
      const num = Number(consumedQty);
      return type === "4" ? true : isNaN(num) ? false : num >= 0;
    },
    {
      message: "Please enter used used quantity",
      path: ["consumedQty"],
    }
  )
  .refine(
    ({ type, loomQty }) => {
      const num = Number(loomQty);
      return type !== "4" ? true : isNaN(num) ? false : num >= 0;
    },
    {
      message: "Please enter used Loom waste quantity",
      path: ["loomQty"],
    }
  )
  .refine(
    ({ type, lamQty }) => {
      const num = Number(lamQty);
      return type !== "4" ? true : isNaN(num) ? false : num >= 0;
    },
    {
      message: "Please enter used Lam waste quantity",
      path: ["lamQty"],
    }
  )
  .refine(
    ({ type, tapeQty }) => {
      const num = Number(tapeQty);
      return type !== "4" ? true : isNaN(num) ? false : num >= 0;
    },
    {
      message: "Please enter used Tape waste quantity",
      path: ["tapeQty"],
    }
  )
  .refine(
    ({ type, tarpQty }) => {
      console.log("type", type);
      const num = Number(tarpQty);
      return type !== "4" ? true : isNaN(num) ? false : num >= 0;
    },
    {
      message: "Please enter used Tarp waste quantity",
      path: ["tarpQty"],
    }
  );

type TCreateInventoryFormValues = z.infer<typeof formSchema>;

type TUnitFormItemProps = {
  form: UseFormReturn<TCreateInventoryFormValues>;
  departments: TDepartment[];
  categories: TCategory[];
  index: number;
  disabled: boolean;
  onPressRemove: () => void;
  initial?: TRpItemFull;
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

const consumedUnits: Record<string, string> = {
  "0": "Bhusa Consumed (Num)",
  "1": "Agglo Consumed (Num)",
  "2": "Mix 1st Consumed (Num)",
  "3": "Tape Waste Consumed",
  "4": "Plant Waste Consumed",
  "5": "Black(Tape) 1st Consumed",
  "6": "Black(Lam) 1st Consumed",
};

const producedUnits: Record<string, string> = {
  "0": "Agglo Produced Qty (Num)",
  "1": "RP Mix 1st Produced (Num - Kg)",
  "2": "Mix 2nd Produced (Num - Kg)",
  "3": "RP Black(Tape) 1st Produced (Num - Kg)",
  "4": "RP Black(Lam) 1st Produced (Num - Kg)",
  "5": "Black(Tape) 2nd Produced (Num - Kg)",
  "6": "Black(Lam) 2nd Produced (Num - Kg)",
};

export const CreateRP: FC<
  Pick<TUnitFormItemProps, "categories" | "departments"> & {
    initialData?: TRpFull;
  }
> = (props) => {
  const { categories, departments, initialData } = props;
  const title = "Create RP";
  const description = "Create a new RP";

  const [loading, setLoading] = useState(false);
  const [isGettingQuantity, setIsGettingQuantity] = useState(false);
  const [quantityData, setQuantityData] = useState<
    TQuantity | null | undefined
  >();
  const action = initialData ? "Update" : "Add";

  const defaultValues: TCreateInventoryFormValues = !!initialData
    ? {
        consumedQty: initialData.consumedQty?.toString() || null,
        producedQty: initialData.producedQty.toString(),

        loomQty: initialData.loomQty?.toString() || null,
        lamQty: initialData.lamQty?.toString() || null,
        tapeQty: initialData.tapeQty?.toString() || null,
        tarpQty: initialData.tarpQty?.toString() || null,

        rpLumps: initialData.rpLumps?.toString() || "",
        shift: initialData.shift,
        type: initialData.type.toString(),
        date: initialData.date,
        items: initialData.items.map((item) => ({
          categoryId: item.categoryId.toString(),
          departmentId: item.departmentId.toString(),
          itemId: item.itemId.toString(),
          inventoryId: item.inventoryId.toString(),
          quantity: item.quantity.toString(),
        })),
      }
    : {
        consumedQty: null,
        producedQty: "",
        loomQty: null,
        lamQty: null,
        tapeQty: null,
        tarpQty: null,
        rpLumps: null,
        shift: "",
        type: "",
        date: new Date(),
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

  const type = form.watch("type");

  const onSubmit = useCallback(
    async (data: TCreateInventoryFormValues) => {
      console.log("data", data);

      try {
        setLoading(true);
        await createRp(
          {
            shift: data.shift,
            type: Number(data.type),
            consumedQty:
              (data.consumedQty?.length || 0) > 0
                ? Number(data.consumedQty)
                : null,
            loomQty:
              (data.loomQty?.length || 0) > 0 ? Number(data.loomQty) : null,
            lamQty: (data.lamQty?.length || 0) > 0 ? Number(data.lamQty) : null,
            tapeQty:
              (data.tapeQty?.length || 0) > 0 ? Number(data.tapeQty) : null,
            tarpQty:
              (data.tarpQty?.length || 0) > 0 ? Number(data.tarpQty) : null,
            producedQty: Number(data.producedQty),
            date: data.date,
            rpLumps: Number(data.rpLumps),
          },
          data.items.map((item) => ({
            categoryId: Number(item.categoryId),
            departmentId: Number(item.departmentId),
            inventoryId: Number(item.inventoryId),
            itemId: Number(item.itemId),
            quantity: Number(item.quantity),
          }))
        );
        router.push(`/dashboard/rp?type=${type}`);
        router.refresh();
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    },
    [type]
  );

  const isDisabled = !!initialData;

  console.log("initialData", initialData);

  const canUpdate = !initialData;

  useEffect(() => {
    (async () => {
      try {
        setQuantityData(undefined);
        setIsGettingQuantity(true);
        const data = await getQuantityDetails(getRpPreviousConsumedId(type));
        setQuantityData(data);
      } catch (error) {
      } finally {
        setIsGettingQuantity(false);
      }
    })();
  }, [type]);

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
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>RP Type</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={(e) => {
                      if (e === "0") {
                        form.setValue("rpLumps", "10");
                      } else {
                        form.setValue("rpLumps", "0");
                      }
                      field.onChange(e);
                    }}
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
                      {RP_TYPE.map((item, index) => (
                        <SelectItem
                          key={index.toString()}
                          value={index.toString()}
                        >
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
          {type === "" ? null : (
            <div className="md:grid grid-cols-1 items-center md:grid-cols-2 gap-8 space-y-8 lg:space-y-0 items-center">
              {type === "4" ? null : (
                <FormField
                  control={form.control}
                  name="consumedQty"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {consumedUnits[form.getValues("type")]}

                        {isDisabled
                          ? ""
                          : `(Available ${
                              (quantityData?.producedQty || 0) -
                              (quantityData?.usedQty || 0)
                            })`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter used quantity"
                          {...(field as any)}
                          type="number"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {type === "4" ? (
                <FormField
                  control={form.control}
                  name="loomQty"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Loom Waste Used
                        {/* {isDisabled
                          ? ""
                          : `(Available ${
                              (quantityData?.producedQty || 0) -
                              (quantityData?.usedQty || 0)
                            })`} */}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter used quantity"
                          {...(field as any)}
                          type="number"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              {type === "4" ? (
                <FormField
                  control={form.control}
                  name="lamQty"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Lam Waste Used
                        {/* {isDisabled
                          ? ""
                          : `(Available ${
                              (quantityData?.producedQty || 0) -
                              (quantityData?.usedQty || 0)
                            })`} */}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter used quantity"
                          {...(field as any)}
                          type="number"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              {type === "4" ? (
                <FormField
                  control={form.control}
                  name="tapeQty"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Tape Waste Used
                        {/* {isDisabled
                          ? ""
                          : `(Available ${
                              (quantityData?.producedQty || 0) -
                              (quantityData?.usedQty || 0)
                            })`} */}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter used quantity"
                          {...(field as any)}
                          type="number"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              {type === "4" ? (
                <FormField
                  control={form.control}
                  name="tarpQty"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Tarp Waste Used
                        {/* {isDisabled
                          ? ""
                          : `(Available ${
                              (quantityData?.producedQty || 0) -
                              (quantityData?.usedQty || 0)
                            })`} */}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter used quantity"
                          {...(field as any)}
                          type="number"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                disabled={isDisabled}
                control={form.control}
                name="producedQty"
                render={({ field }) => (
                  <FormItem inputMode="numeric">
                    <FormLabel>
                      {producedUnits[form.getValues("type")]}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter used quantity"
                        {...(field as any)}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.getValues("type") === "0" ? null : (
                <FormField
                  disabled={!canUpdate}
                  control={form.control}
                  name="rpLumps"
                  render={({ field }) => (
                    <FormItem inputMode="numeric">
                      <FormLabel>RP Lumps</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter lumps"
                          {...(field as any)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
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
