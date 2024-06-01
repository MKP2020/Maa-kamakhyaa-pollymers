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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { useToast } from "../ui/use-toast";
import { TGrade } from "@/lib/types";

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
import { createGrade, deleteGrade, updateGrade } from "@/actions/grade";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GRADES, GRADE_TYPES } from "@/lib/utils";

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  type: z.string().regex(/^\d+\.?\d*$/, "Please select a type of grade"),
  grade: z.string().min(1, { message: "Please enter a valid grade" }),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData: TGrade | null;
}

export const CreateGradeForm: React.FC<UserFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Grade" : "Create a new Grade";
  const description = initialData ? "Edit grade details." : "Add a new grade";
  const toastMessage = initialData ? "Grade updated." : "Grade created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        grade: initialData.grade || "",
      }
    : {
        grade: "",
      };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      if (!!initialData) {
        await updateGrade(initialData.id, data.grade);
      } else {
        await createGrade(data.grade);
      }

      router.push(`/dashboard/grade`);
      router.refresh();
      toast({
        title: "Success!",
        description: toastMessage,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was a problem with your request.",
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
      router.push(`/${params.storeId}/grade`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
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
              grade.
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
                await deleteGrade(initialData!.id);
                router.push("/dashboard/grade");
                router.refresh();
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
                <FormItem className="flex flex-col">
                  <FormLabel>Type</FormLabel>
                  <Select
                    disabled={!!initialData}
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
                      {GRADES.map((item) => (
                        <SelectItem
                          key={item.toString()}
                          value={item.toString()}
                        >
                          {GRADE_TYPES[item]}
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
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fabric drage</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter grade"
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
