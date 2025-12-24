import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { propertyClint } from "../store/index";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const propertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  price: z.number().min(0, "Price must be positive"),
  location: z.string().optional().nullable(),
  bedrooms: z.number().optional().nullable(),
  bathrooms: z.number().optional().nullable(),
  property_type: z.string(),
  status: z.enum(["Ready_to_Move", "Under_Construction", "New_Launch", "Rent", "Sell", "Lease"]),
  metaTitle: z.string().optional().nullable(),
  metaTags: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface EditPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: (PropertyFormData & { id: string }) | null;
  onUpdate: (updatedProperty: any) => void;
}

export const EditPropertyDialog: React.FC<EditPropertyDialogProps> = ({
  open,
  onOpenChange,
  property,
  onUpdate,
}) => {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      price: 0,
      location: "",
      bedrooms: null,
      bathrooms: null,
      property_type: "",
      status: "Ready_to_Move",
      metaTitle: "",
      metaTags: "",
      metaDescription: "",
    },
  });

  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        price: property.price,
        location: property.location,
        bedrooms: property.bedrooms || null,
        bathrooms: property.bathrooms || null,
        property_type: property.property_type,
        status: property.status as any,
        metaTitle: property.metaTitle || "",
        metaTags: property.metaTags || "",
        metaDescription: property.metaDescription || "",
      });
    }
  }, [property, form]);

  const onSubmit = async (data: PropertyFormData) => {
    if (!property) return;

    try {
      const payload = {
        price: data.price,
        status: data.status,
        metaTitle: data.metaTitle,
        metaTags: data.metaTags,
        metaDescription: data.metaDescription,
      };

      const response = await propertyClint.updateProperty(property.id, payload);
      const updatedProperty = response.property || { id: property.id, ...payload };

      onUpdate(updatedProperty);
      toast.success(response.message || "Property updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update property");
    }
  };

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>Modify the property details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} disabled /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input value={value ?? ""} {...rest} disabled /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <FormControl><Input {...field} disabled /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ready_to_Move">Ready to Move</SelectItem>
                      <SelectItem value="Under_Construction">Under Construction</SelectItem>
                      <SelectItem value="New_Launch">New Launch</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Sell">Sell</SelectItem>
                      <SelectItem value="Lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SEO Meta Details</h3>
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl><Input placeholder="SEO Optimized Title" value={value ?? ""} {...rest} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metaTags"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Meta Tags</FormLabel>
                    <FormControl><Input placeholder="tag1, tag2, tag3" value={value ?? ""} {...rest} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field: { value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl><Textarea placeholder="Short description for search engines..." value={value ?? ""} {...rest} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};