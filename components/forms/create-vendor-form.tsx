"use client";
import { useMemo, useState } from "react";
import { State, City } from "country-state-city";
import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { TCategory, TVendorsFull } from "@/lib/schema";
import { getUserRole, getVendorType } from "@/lib/users";
import { useToast } from "../ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { createVendor, deleteVendor } from "@/actions/vendor";
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

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  type: z.string().default("0"),
  name: z.string().min(1),
  contactNumber: z.string().length(10),
  email: z.string().email({ message: "Please enter a valid email" }),
  category: z.string(),
  addressLine1: z.string().min(8),
  addressLine2: z.string().optional(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pinCode: z.string(),

  accountNumber: z.string().min(4),
  ifsc: z.string().min(4),
  branch: z.string(),

  gstNumber: z.string(),
  pan: z.string().length(10),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: TVendorsFull;
  categories: TCategory[];
}

export const CreteVendorForm: React.FC<UserFormProps> = ({
  initialData,
  categories,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit Vendor" : "Create New Vendor";
  const description = initialData ? "Edit vendor details." : "Add a new vendor";
  const toastMessage = initialData ? "Vendor updated." : "Vendor created.";
  const action = initialData ? "Save changes" : "Create";

  const [selectedState, setSelectedState] = useState<string>(
    initialData?.address?.state || ""
  );
  const defaultValues: typeof formSchema._type = !!initialData
    ? {
        type: initialData.type.toString(),
        name: initialData.name,
        contactNumber: initialData.contactNumber,
        email: initialData.emailId,
        category: initialData.categoryId.toString(),
        addressLine1: initialData.address.addressLine1,
        addressLine2: initialData.address.addressLine2 || undefined,
        city: initialData.address.city.toLowerCase(),
        district: initialData.address.district,
        state: initialData.address.state,
        pinCode: initialData.address.pinCode,
        accountNumber: initialData.bankDetails.accountNumber,
        ifsc: initialData.bankDetails.ifsc,
        pan: initialData.pan,
        gstNumber: initialData.gstNumber,
        branch: initialData.bankDetails.branch,
      }
    : ({
        type: "0",
        name: "",
        contactNumber: "",
        email: "",
      } as any);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  console.log("selectedState", selectedState);

  const states = useMemo(() => State.getStatesOfCountry("IN"), []);

  const cities = useMemo(
    () =>
      !selectedState
        ? []
        : City.getCitiesOfState("IN", (selectedState || "").toUpperCase()),
    [selectedState]
  );

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (!initialData) {
        await createVendor({
          ...data,
          type: getVendorType(Number(data.type)),
          categoryId: data.category,
        });
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
      }
      router.refresh();
      router.push(`/dashboard/vendor`);
      toast({
        title: toastMessage,
        description: !initialData
          ? "Vendor successfully created"
          : "Vendor successfully updated",
      });
    } catch (error: any) {
      console.log(error);
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
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["0", "1"].map((roleType) => (
                        <SelectItem key={roleType} value={roleType}>
                          {getVendorType(Number(roleType))}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Vendor name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Vendor email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Contact number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
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
          </div>
          <Separator className="my-2" />
          <h3>Vendor Address Details</h3>
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      setSelectedState(value);
                      field.onChange(value);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a state"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem
                          key={state.isoCode}
                          value={state.isoCode.toLowerCase()}
                        >
                          {state.name}
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
              name="city"
              render={({ field, formState, fieldState }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a city"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem
                          key={city.name}
                          value={city.name.toLowerCase()}
                        >
                          {city.name}
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
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-2" />
          <h3>Vendor Banking Details</h3>
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ifsc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-2" />
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="gstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSTN</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
