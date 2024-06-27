"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "../ui/use-toast";
import { getUserRole } from "@/lib/users";
import { createUser, updateUser } from "@/actions/users";
import { TDepartment } from "@/lib/types";
import { departments } from "@/lib/schemas";

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Please enter a valid first name" }),
  lastName: z.string().min(1, { message: "Please enter a valid last name" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  // department: z.string().regex(/^\d+\.?\d*$/, "Please select a department"),
  password: z.string().min(4).max(10),
  role: z.string(),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData: any | null;
  // departments: TDepartment[];
}

export const CreateUserForm: React.FC<UserFormProps> = ({
  initialData,
  // departments,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit User" : "Create New User";
  const description = initialData ? "Edit user details." : "Add a new user";
  const toastMessage = initialData ? "User updated." : "User created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        password: "",
        // department: initialData.departmentId.toString(),
        role: initialData.role.toString(),
      }
    : {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "1",
      };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      console.log("data", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: parseInt(data.role),
        // departmentId: Number(data.department),
      });
      if (!!initialData) {
        await updateUser({
          id: initialData.id,
          clerkId: initialData.clerkId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: parseInt(data.role),
          // departmentId: Number(data.department),
        });
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        await createUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          role: parseInt(data.role),
          // departmentId: Number(data.department),
        });
      }
      router.refresh();
      router.push(`/dashboard/user`);
      toast({
        title: "Created!",
        description: "User successfully created",
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

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!!initialData ? null : (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        type="email"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*<FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Department</FormLabel>
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
                          placeholder="Select a department"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                     
                      {departments.map((department) => (
                        <SelectItem
                          key={department.id.toString()}
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
            />*/}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Role</FormLabel>
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
                          placeholder="Select a role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* @ts-ignore  */}
                      {["0", "1", "2", "3", "4"].map((roleType) => (
                        <SelectItem key={roleType} value={roleType}>
                          {getUserRole(Number(roleType))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
