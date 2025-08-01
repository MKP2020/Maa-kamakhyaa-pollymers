"use client";
import type {
  TGRNFull,
  TPurchaseOrder,
  TPurchaseOrderItemFull,
} from "@/lib/types";
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createGrn } from '@/actions/grn';
import { getPurchaseOrderItems } from '@/actions/purchaseOrder';
import { cn, getGRNNumber } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Heading } from '../ui/heading';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { toast } from '../ui/use-toast';

import type { FC } from "react";
type TCreateGRN = {
  initialData?: TGRNFull;
  purchaseOrders: TPurchaseOrder[];
};

const formSchema = z
  .object({
    poId: z.string().regex(/^\d+\.?\d*$/, "Please select a purchase order"),
    receivedDate: z.date(),
    invoiceNumber: z.string().min(4, "Please enter a valid invoice number"),
    invoiceDate: z.date(),
    transportMode: z.string(),
    transportName: z.string(),
    cnNumber: z.string(),
    vehicleNumber: z.string(),
    freightAmount: z.string().regex(/^\d+\.?\d*$/),
    taxType: z.string().min(1, "Please select a tax type"),
    sgst: z.string().optional().nullable(),
    igst: z.string().optional().nullable(),
    cgst: z.string().optional().nullable(),
    items: z.array(
      z.object({
        itemId: z.string().regex(/^\d+\.?\d*$/),
        quantity: z
          .string()
          .min(1, "Please enter some quantity")
          .regex(/^\d+\.?\d*$/),
      })
    ),
  })
  .refine(
    ({ taxType, igst }) => {
      if (taxType === "IGST") {
        return !isNaN(Number(igst));
      }
      return true;
    },
    {
      message: "Please enter IGST percentage",
      path: ["igst"],
    }
  )
  .refine(
    ({ taxType, cgst }) => {
      if (taxType === "CGST+SGST") {
        return !isNaN(Number(cgst));
      }
      return true;
    },
    {
      message: "Please enter CGST percentage",
      path: ["cgst"],
    }
  )
  .refine(
    ({ taxType, sgst }) => {
      if (taxType === "CGST+SGST") {
        return !isNaN(Number(sgst));
      }
      return true;
    },
    {
      message: "Please enter SGST percentage",
      path: ["sgst"],
    }
  );

type NewGRNFormValues = z.infer<typeof formSchema>;

export const CreateGRN: FC<TCreateGRN> = (props) => {
  const { initialData, purchaseOrders } = props;
  const title = initialData ? "View GRN" : "Create GRN";
  const description = initialData ? "View GRN details." : "Add a new GRN";
  const toastMessage = initialData ? "GRN updated." : "GRN created.";
  const action = initialData ? "Save changes" : "Create";

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [selectedPo, setSelectedPo] = useState<number | undefined>(
    initialData?.poId
  );

  const [poItems, setPoItems] = useState<TPurchaseOrderItemFull[]>(
    initialData ? initialData.po.items : []
  );

  const defaultValues: typeof formSchema._type = !!initialData
    ? ({
        poId: `${initialData.poId}`,
        receivedDate: initialData.receivedDate,
        invoiceNumber: initialData.invoiceNumber,
        invoiceDate: initialData.invoiceDate,
        transportMode: initialData.transportMode,
        transportName: initialData.transportName,
        cnNumber: initialData.cnNumber,
        vehicleNumber: initialData.vehicleNumber,
        freightAmount: initialData.freightAmount.toString(),
        taxType: initialData.taxType,
        cgst: initialData.cgst?.toString(),
        igst: initialData.igst?.toString(),
        sgst: initialData.sgst?.toString(),

        items: initialData.items.map((item) => ({
          itemId: item.itemId.toString(),
          quantity: item.inStockQuantity.toString(),
        })),
      } as any)
    : {};

  const form = useForm<NewGRNFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isDisabled = !!initialData || loading;
  const onSubmit = useCallback(
    async (data: NewGRNFormValues) => {
      const { igst, cgst, sgst, taxType } = data;
      try {
        setLoading(true);

        if (!initialData) {
          await createGrn(
            {
              grnNumber: getGRNNumber(data.receivedDate),
              poId: Number(data.poId),
              invoiceNumber: data.invoiceNumber,
              transportMode: data.transportMode,
              transportName: data.transportName,
              cnNumber: data.cnNumber,
              taxType,
              igst: taxType === "IGST" ? Number(igst) : null,
              cgst: taxType !== "IGST" ? Number(cgst) : null,
              sgst: taxType !== "IGST" ? Number(sgst) : null,
              vehicleNumber: data.vehicleNumber,
              freightAmount: Number(data.freightAmount),
              receivedDate: data.receivedDate!,
              invoiceDate: data.invoiceDate!,
            },
            data.items.map((item, index) => {
              const _item = poItems.find(
                (i) => i.itemId === Number(item.itemId)
              )!;
              return {
                categoryId: _item.item.indent.categoryId,
                itemId: Number(_item.item.itemId),
                poItemId: Number(_item.item.itemId),
                usedQuantity: 0,
                inStockQuantity: Number(item.quantity),
                departmentId: _item.item.indent.departmentId,
              };
            })
          );
        } else {
        }
        router.push(`/dashboard/grn`);
        router.refresh();

        toast({
          title: toastMessage,
          description: !initialData
            ? "GRN successfully created"
            : "GRN successfully updated",
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
    [initialData, poItems]
  );

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const values = form.watch("items");
  const taxValues = form.getValues();
  const taxType = form.watch("taxType");

  const total = () => {
    let total = 0;

    if (!taxType) return total.toString();
    if (!poItems || poItems.length === 0) return;

    // Calculate base total first
    values.map((item, index) => {
      const qNum = Number(item.quantity);
      total += (isNaN(qNum) ? 0 : qNum) * poItems[index].price;
    });

    // Then calculate tax on the total
    let totalTax = 0;
    if (taxType === "IGST") {
      if (!taxValues.igst) {
        return total.toString();
      }
      totalTax = (total * Number(taxValues.igst)) / 100;
    } else if (taxType !== "IGST") {
      if (!(taxValues.cgst && taxValues.sgst)) {
        return total.toString();
      }
      totalTax =
        (total * Number(taxValues.cgst)) / 100 +
        (total * Number(taxValues.sgst)) / 100;
    }

    return (total + totalTax).toString();
  };

  useEffect(() => {
    form.resetField("sgst");
    form.resetField("cgst");
    form.resetField("igst");
  }, [taxType]);

  useEffect(() => {
    if (!selectedPo) return;
    if (!!initialData) return;

    (async () => {
      try {
        setPoItems([]);
        form.setValue("items", []);
        const response = await getPurchaseOrderItems(selectedPo);
        setPoItems(response as any);

        form.setValue(
          "items",
          response.map((item) => ({
            itemId: item.itemId.toString(),
            quantity: "",
          }))
        );
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, [selectedPo, initialData]);

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
              name="poId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={(e) => {
                      field.onChange(e);
                      setSelectedPo(Number(e));
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a PO"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {purchaseOrders.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id.toString()}>
                          {pos.poNumber}
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
              name="receivedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Received Date</FormLabel>
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
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isDisabled}
                      placeholder="Enter invoice number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Invoice Date</FormLabel>
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
            <FormField
              control={form.control}
              name="transportMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode of Transport</FormLabel>
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
                          placeholder="Select a mode of transport"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Rail", "Road", "Cargo"].map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
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
              name="transportName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transporter Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isDisabled}
                      placeholder="Enter transporter name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CN Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isDisabled}
                      placeholder="Enter cn number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isDisabled}
                      placeholder="Enter vehicle number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="freightAmount"
              render={({ field }) => (
                <FormItem inputMode="numeric">
                  <FormLabel>Freight Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isDisabled}
                      placeholder="Enter vehicle number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-2" />
          <h3>Received Items</h3>
          {!selectedPo ? (
            <span>Select an purchase order</span>
          ) : (
            fields.map((field, iIndex) => {
              return !selectedPo ? (
                <span key={iIndex}>Select an purchase order</span>
              ) : (
                <div key={field.id}>
                  <div className="md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 space-y-8 lg:space-y-0 ">
                    <FormItem
                      defaultValue={poItems[iIndex]?.item?.item?.name}
                      inputMode="numeric"
                    >
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input
                          defaultValue={poItems[iIndex]?.item?.item?.name}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormField
                      {...form.register(`items.${iIndex}.quantity` as any)}
                      render={({ field: fField }) => {
                        return (
                          <FormItem inputMode="numeric">
                            <FormLabel>Received Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter quantity"
                                {...fField}
                                disabled={isDisabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormItem
                      defaultValue={poItems[iIndex]?.price}
                      inputMode="numeric"
                    >
                      <FormLabel>Item Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          defaultValue={poItems[iIndex]?.price}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    {/* Remove Button */}
                    {!isDisabled && (
                      <div className="flex items-end">
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to remove this item?"
                              )
                            ) {
                              remove(iIndex);
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <Separator className="my-2" />
          <h3>GST</h3>
          <div className="md:grid md:grid-cols-3 gap-8 space-y-8 lg:space-y-0">
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
                        {["CGST+SGST", "IGST"].map((tType) => (
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
            {taxType === "IGST" ? (
              <FormField
                control={form.control}
                name="igst"
                render={({ field }) => (
                  <FormItem inputMode="numeric">
                    <FormLabel>Tax Percentage</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isDisabled}
                        type="number"
                        placeholder="Enter tax percentage"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {taxType == "CGST+SGST" ? (
              <FormField
                control={form.control}
                name="sgst"
                render={({ field }) => (
                  <FormItem inputMode="numeric">
                    <FormLabel>SGST Tax Percentage</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isDisabled}
                        type="number"
                        placeholder="Enter tax percentage"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {taxType === "CGST+SGST" ? (
              <FormField
                control={form.control}
                name="cgst"
                render={({ field }) => (
                  <FormItem inputMode="numeric">
                    <FormLabel>CGST Tax Percentage</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isDisabled}
                        type="number"
                        placeholder="Enter tax percentage"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormItem inputMode="numeric">
              <FormLabel>Net Amount</FormLabel>
              <FormControl>
                <Input
                  disabled
                  type="number"
                  value={total()}
                  placeholder="Enter tax percentage"
                  // value={form.getValues('')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          {!initialData ? (
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
