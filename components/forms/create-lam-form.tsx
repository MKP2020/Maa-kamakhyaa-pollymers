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
  TLamFull,
  TLamItemFull,
  TLoomFull,
  TLoomItem,
  TLoomItemFull,
} from "@/lib/schemas";
import { TCategory } from "@/lib/schema";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { TGrade, TGradeWithQuantity } from "@/lib/types";
import { createLoom } from "@/actions/loom";
import { createLam } from "@/actions/lam";

const formSchema = z.object({
  date: z.date(),
  shift: z.string(),

  fabricGrade: z.string().regex(/^\d+\.?\d*$/, "Please select a grade"),
  fabricQty: z.string().regex(/^\d+\.?\d*$/),
  lamFabricGrade: z.string().regex(/^\d+\.?\d*$/, "Please select a grade"),
  lamFabricQty: z.string().regex(/^\d+\.?\d*$/),

  lamWaste: z.string().regex(/^\d+\.?\d*$/),

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

type TCreateLamFormValues = z.infer<typeof formSchema>;

type TUnitFormItemProps = {
  form: UseFormReturn<TCreateLamFormValues>;
  departments: TDepartment[];
  categories: TCategory[];
  index: number;
  disabled: boolean;
  onPressRemove: () => void;
  initial?: TLamItemFull;
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

export const CreateLoomForm: FC<
  Pick<TUnitFormItemProps, "categories" | "departments"> & {
    initialData?: TLamFull;
    fabricGrades: TGradeWithQuantity[];
    laminatedFabricGrades: TGrade[];
  }
> = (props) => {
  const {
    categories,
    fabricGrades,
    departments,
    laminatedFabricGrades,
    initialData,
  } = props;
  const title = !!initialData ? "View Loom" : "Create Loom";
  const description = !!initialData ? "view loom" : "Create a new loom";

  const [loading, setLoading] = useState(false);

  const action = initialData ? "Update" : "Add";

  const defaultValues: TCreateLamFormValues = !!initialData
    ? {
        date: initialData.date,
        shift: initialData.shift,
        fabricGrade: initialData.fabricGradeId.toString(),
        fabricQty: initialData.fabricQty.toString(),
        lamWaste: initialData.lamWaste.toString(),
        lamFabricGrade: initialData.lamFabricGradeId.toString(),
        lamFabricQty: initialData.lamFabricQty.toString(),
        items: initialData.items.map((item) => ({
          categoryId: item.categoryId.toString(),
          departmentId: item.departmentId.toString(),
          itemId: item.itemId.toString(),
          inventoryId: item.inventoryId.toString(),
          quantity: item.quantity.toString(),
        })),
      }
    : {
        shift: "",
        date: new Date(),
        lamFabricGrade: "",
        lamFabricQty: "",
        lamWaste: "",
        fabricGrade: "",
        fabricQty: "",
        items: [],
      };

  const router = useRouter();
  const form = useForm<TCreateLamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = useCallback(async (data: TCreateLamFormValues) => {
    const {
      shift,
      lamFabricGrade,
      lamFabricQty,
      lamWaste,
      fabricGrade,
      fabricQty,
      date,
      items,
    } = data;
    try {
      setLoading(true);
      // TODO: create
      await createLam(
        {
          shift,
          lamFabricGradeId: Number(lamFabricGrade),
          lamFabricQty: Number(lamFabricQty),
          fabricGradeId: Number(fabricGrade),
          fabricQty: Number(fabricQty),
          lamWaste: lamWaste?.length === 0 ? 0 : Number(lamWaste),
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
        )
      );
      router.push(`/dashboard/lamination`);
      router.refresh();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const isDisabled = !!initialData;

  const tapeGradeType = form.watch("fabricGrade");

  const fabricGrade = fabricGrades.find((item) =>
    !tapeGradeType ? false : item.id === Number(tapeGradeType)
  );
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
          <h3>Fabric Consumed</h3>

          <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-8 lg:space-y-0 items-center">
            <FormField
              control={form.control}
              name="fabricGrade"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fabric Grade</FormLabel>
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
                      {fabricGrades.map((item) => (
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
              name="fabricQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Fabric Quantity{" "}
                    {!!fabricGrade
                      ? `(Available ${
                          (fabricGrade.quantity?.producedQty || 0) -
                          (fabricGrade.quantity?.usedQty || 0)
                        })`
                      : ""}
                  </FormLabel>
                  <FormControl inputMode="numeric">
                    <Input
                      disabled={isDisabled}
                      placeholder="Enter quantity"
                      {...field}
                      min={0}
                      max={
                        !fabricGrade
                          ? 0
                          : (fabricGrade.quantity?.producedQty || 0) -
                            (fabricGrade.quantity?.usedQty || 0)
                      }
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
          <h3>Laminated Fabric Produced</h3>

          <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-8 lg:space-y-0 items-center">
            <FormField
              control={form.control}
              name="lamFabricGrade"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Laminated Fabric Grade</FormLabel>
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
                      {laminatedFabricGrades.map((item) => (
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
              name="lamFabricQty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Laminated Fabric Produced Quantity</FormLabel>
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
              name="lamWaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lam Waste</FormLabel>
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
