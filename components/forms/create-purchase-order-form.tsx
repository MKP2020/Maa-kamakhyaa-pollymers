"use client";
import type { TIndent, TPurchaseOrder } from "@/lib/types";
import { useCallback, useMemo, useState, type FC } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
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
import { TVendors } from "@/lib/schema";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn, getApprovalStatusText, getPONumber } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import {
  createPurchaseOrder,
  updatePurchaseOrder,
} from "@/actions/purchaseOrder";

type TCreatePurchaseOrder = {
  initialData?: TPurchaseOrder;
  indents: TIndent[];
  vendors: TVendors[];
  canApprove: boolean;
};

type TCreatePOFormTypes = {
  sellerId: string;
  indentId: string;
  date: string;
  taxType: string;
  taxPercentage: string;
  approvalStatus: string;
};

const formSchema = z.object({
  sellerId: z.string().regex(/^\d+\.?\d*$/),
  indentId: z.string().regex(/^\d+\.?\d*$/),
  date: z.date(),
  taxType: z.string().min(1, "Please select a tax type"),
  taxPercentage: z.string().regex(/^\d+\.?\d*$/),
  approvalStatus: z
    .string()
    .regex(/^\d+\.?\d*$/, "Please select an approval status"),
  status: z.string(),

  items: z.array(
    z.object({
      itemId: z.string().regex(/^\d+\.?\d*$/),
      price: z
        .string()
        .min(1, "Please enter some amount")
        .regex(/^\d+\.?\d*$/),
    })
  ),
});

type NewPurchaseOrderFormValues = z.infer<typeof formSchema>;

export const CreatePurchaseOrder: FC<TCreatePurchaseOrder> = (props) => {
  const { initialData, indents, vendors, canApprove } = props;
  const title = initialData ? "View Purchase Order" : "Create Purchase Order";
  const description = initialData
    ? "View Purchase Order details."
    : "Add a new Purchase Order";
  const toastMessage = initialData
    ? "Purchase Order updated."
    : "Purchase Order created.";
  const action = initialData ? "Save changes" : "Create";
  const [selectedIndentIndex, setSelectedIndentIndex] = useState<
    number | undefined
  >(!!initialData ? 0 : undefined);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const defaultValues: typeof formSchema._type = !!initialData
    ? ({
        sellerId: initialData.sellerId.toString(),
        indentId: initialData.indentId.toString(),
        date: initialData.date,
        taxType: initialData.taxType,
        taxPercentage: initialData.taxPercentage.toString(),
        approvalStatus: initialData.approvalStatus.toString(),
        departmentId: initialData.toString(),
        status: initialData.status.toString(),

        items: initialData.items.map((item: any) => ({
          itemId: item.itemId.toString(),
          price: item.price.toString(),
        })),
      } as any)
    : {
        sellerId: "",
        indentId: "",
        date: "",
        taxType: "",
        taxPercentage: "",
        approvalStatus: "2",
        departmentId: "",
        status: "0",
        items: [] as any,
      };

  const form = useForm<NewPurchaseOrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isDisabled = !!initialData || loading;
  const onSubmit = useCallback(
    async (data: NewPurchaseOrderFormValues) => {
      const {
        items,
        indentId,
        sellerId,
        taxPercentage,
        approvalStatus,
        status,
        ...rest
      } = data;
      try {
        setLoading(true);

        if (!initialData) {
          await createPurchaseOrder(
            {
              sellerId: Number(sellerId),
              indentId: Number(indentId),
              approvalStatus: Number(approvalStatus),
              status: Number(status),
              taxPercentage: Number(taxPercentage),
              poNumber: getPONumber(data.date),
              ...rest,
            },
            items.map((item) => ({
              itemId: Number(item.itemId),
              price: Number(item.price),
              quantity: 0,
            }))
          );
        } else {
          if (initialData.approvalStatus === Number(approvalStatus)) {
            toast({
              title: "Update Failed",
              description: "nothing to update",
              variant: "destructive",
            });
            return;
          }

          await updatePurchaseOrder(initialData.id, {
            approvalStatus: Number(approvalStatus),
          });
        }
        router.push(`/dashboard/purchase-order`);
        router.refresh();

        toast({
          title: toastMessage,
          description: !initialData
            ? "Purchase Order successfully created"
            : "Indent successfully updated",
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

  const { fields } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const indent =
    selectedIndentIndex === undefined
      ? undefined
      : indents[selectedIndentIndex];

  const values = form.getValues();

  const total = useMemo(() => {
    let total = 0;

    if (!indent) return total.toString();
    if (!values.indentId) return total.toString();

    if (!values.taxPercentage) return total.toString();

    const tacPercentageNumber = Number(values.taxPercentage);

    if (isNaN(tacPercentageNumber)) return total.toString();

    for (let index = 0; index < values.items.length; index++) {
      const element = values.items[index];

      const priceNumber = Number(element.price);

      if (isNaN(priceNumber)) {
        continue;
      }

      total += (indent.items[index].approvedQty || 0) * priceNumber;
    }

    const totalTax = (total * tacPercentageNumber) / 100;

    return (total + totalTax).toString();
  }, [values, indent]);

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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="sellerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller</FormLabel>
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
                          placeholder="Select a seller"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem
                          key={vendor.id}
                          value={vendor.id.toString()}
                        >
                          {vendor.name}
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
              name="indentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indent</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={(e) => {
                      field.onChange(e);

                      const itms: any[] = [];

                      const index = indents.findIndex(
                        (d, i) => d.id.toString() === e
                      );

                      indents[index]?.items.forEach((item) => {
                        itms.push({
                          price: "",
                          itemId: item.id.toString(),
                        });
                      });
                      form.setValue("items", itms);

                      setSelectedIndentIndex(index);
                      // setSelectedCategory(Number(e));
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select an indent"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indents?.map((indent) => (
                        <SelectItem
                          key={indent.id}
                          value={indent.id.toString()}
                        >
                          {indent.indentNumber}
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
                  <FormLabel>Order Date</FormLabel>
                  <Popover>
                    <PopoverTrigger disabled={isDisabled} asChild>
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
          <h3>Items</h3>
          {fields.map((field, iIndex) => {
            return !indent ? (
              <span key={iIndex}>Select an indent to update items</span>
            ) : (
              <div key={field.id}>
                <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <FormItem
                    defaultValue={indent.items[iIndex]?.item?.name}
                    inputMode="numeric"
                  >
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={indent.items[iIndex]?.item?.name}
                        // value={indent.items[iIndex]?.item?.name}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem inputMode="numeric">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={indent.items[
                          iIndex
                        ]?.approvedQty?.toString()}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormField
                    {...form.register(`items.${iIndex}.price` as any)}
                    render={({ field }) => (
                      <FormItem inputMode="numeric">
                        <FormLabel>Item Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price"
                            {...field}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}
          <Separator className="my-2" />
          <h3>GST</h3>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="taxType"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tax Type</FormLabel>
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
                            placeholder="Select a tax type"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["CGST", "IGST", "SGST"].map((tType) => (
                          <SelectItem key={tType} value={tType}>
                            {tType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="taxPercentage"
              render={({ field }) => (
                <FormItem inputMode="numeric">
                  <FormLabel>Tax Percentage</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isDisabled}
                      type="number"
                      placeholder="Enter tax percentage"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormItem inputMode="numeric">
              <FormLabel>Net Amount</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="number"
                  value={total}
                  placeholder="Enter tax percentage"
                  // value={form.getValues('')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="approvalStatus"
              render={({ field }) => (
                <FormItem inputMode="numeric">
                  <FormLabel>Approval Status</FormLabel>
                  <Select
                    disabled={
                      !canApprove || (!!initialData && initialData.status === 1)
                    }
                    // disabled={loading || isUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a tax type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["0", "1", "2"].map((tType) => (
                        <SelectItem key={tType} value={tType}>
                          {getApprovalStatusText(tType)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem inputMode="numeric">
              <FormLabel>PO Status</FormLabel>
              <FormControl>
                <Input disabled value={"Pending"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          {(!initialData ? true : initialData && canApprove) ? (
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
