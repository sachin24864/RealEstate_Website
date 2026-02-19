import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { propertyClint } from "../store/index";
import { RichTextEditor } from "./RichTextEditor";

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
import { toast } from "sonner";;

const propertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  location: z.string().min(1, "Location is required").max(200),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  area_sqft: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  property_type: z.string().min(1, "Property type is required"),
  status: z.string().min(1, "Status is required"),
  images: z.array(z.any()).max(10, "You can upload up to 10 images").optional(),
  metaTitle: z.string().optional(),
  metaTags: z.string().optional(),
  metaDescription: z.string().optional(),
  price_unit: z.string().min(1, "Price unit is required"),
  Sub_type: z.string().min(1, "Sub type is required"),
  slug: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (newProperty: any) => void;
}

export function AddPropertyDialog({ open, onOpenChange, onAdd }: AddPropertyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      area_sqft: "",
      unit: "",
      property_type: "",
      status: "",
      images: [],
      metaTitle: "",
      metaTags: "",
      metaDescription: "",
      price_unit: "",
      Sub_type: "",
      slug: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 10) {
      toast.error("You can upload a maximum of 10 images.");
      return;
    }
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    form.setValue("images", files);
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("price", data.price);
      formData.append("location", data.location);
      formData.append("property_type", data.property_type);
      formData.append("status", data.status);

      // New SEO Fields
      formData.append("metaTitle", data.metaTitle || "");
      formData.append("metaTags", data.metaTags || "");
      formData.append("metaDescription", data.metaDescription || "");
      formData.append("slug", data.slug || "");

      if (data.bedrooms) formData.append("bedrooms", data.bedrooms);
      if (data.bathrooms) formData.append("bathrooms", data.bathrooms);
      if (data.area_sqft) formData.append("area_sqft", data.area_sqft);
      if (data.unit) formData.append("unit", data.unit);
      if (data.price_unit) formData.append("price_unit", data.price_unit);
      if (data.Sub_type) formData.append("subType", data.Sub_type);


      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => formData.append("images", file));
      }

      const response = await propertyClint.createProperty(formData);
      toast.success(response.message || "Property added successfully!");
      if (onAdd && response.property) onAdd(response.property);

      form.reset();
      setImagePreviews([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to add property: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>Fill in the details to add a new property listing</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Beautiful 3BR House" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><RichTextEditor value={field.value || ""} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-2 gap-2">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <div className="flex gap-1">
                    <FormControl className="flex-1"><Input type="number" placeholder="40000" {...field} /></FormControl>
                    <FormField control={form.control} name="price_unit" render={({ field: unitField }) => (
                      <FormControl>
                        <Select onValueChange={unitField.onChange} value={unitField.value}>
                          <SelectTrigger className="w-[90px]"><SelectValue placeholder="Unit" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per sqft">per sq.ft</SelectItem>
                            <SelectItem value="per sqmeter">per sq.m</SelectItem>
                            <SelectItem value="per sqyard"> per sq.yd</SelectItem>
                            <SelectItem value="per acre"> per Acre</SelectItem>
                            <SelectItem value="per month"> Per Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    )} />
                  </div>
                </FormItem>
              )} />
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="New York" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <FormField control={form.control} name="bedrooms" render={({ field }) => (
                <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" placeholder="3" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="bathrooms" render={({ field }) => (
                <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" placeholder="2" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="area_sqft" render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <div className="flex gap-1">
                    <FormControl className="flex-1"><Input type="number" placeholder="Area" {...field} /></FormControl>
                    <FormField control={form.control} name="unit" render={({ field: unitField }) => (
                      <FormControl>
                        <Select onValueChange={unitField.onChange} value={unitField.value}>
                          <SelectTrigger className="w-[70px]"><SelectValue placeholder="Unit" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sqft">sq.ft</SelectItem>
                            <SelectItem value="sqmeter">sq.m</SelectItem>
                            <SelectItem value="sqyard">sq.yd</SelectItem>
                            <SelectItem value="acre">Acre</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    )} />
                  </div>
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="property_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Farm House">Farm House</SelectItem>
                      <SelectItem value="Agricultural Land">Agricultural Land</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="Sub_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Plot">Plot</SelectItem>
                      <SelectItem value="Floor">Floor</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="SCO Flats">SCO Plots</SelectItem>
                      <SelectItem value="Space">Space</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
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
              )} />
            </div>

            {/* SEO Section */}
            <div className="border-t pt-4 mt-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">SEO Settings</h3>
              {/* <FormField control={form.control} name="metaTitle" render={({ field }) => (
                <FormItem><FormLabel>Meta Title</FormLabel><FormControl><Input placeholder="SEO Title" {...field} /></FormControl><FormMessage /></FormItem>
              )} /> */}
              <FormField control={form.control} name="metaTags" render={({ field }) => (
                <FormItem><FormLabel>Meta Tags</FormLabel><FormControl><Input placeholder="keywords separated by commas" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="metaDescription" render={({ field }) => (
                <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Textarea placeholder="Short SEO description" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="blog-url-slug"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      Slug has to be unique. If it same slug exists, property creation will fail.
                    </p>
                  </FormItem>
                )}
              />

            </div>
            <FormItem>
              <FormLabel>Property Images (max 10)</FormLabel>
              <FormControl><Input type="file" multiple accept="image/*" onChange={handleImageChange} /></FormControl>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imagePreviews.map((src, i) => (<img key={i} src={src} alt="Preview" className="w-full h-28 object-cover rounded-md border" />))}
                </div>
              )}
            </FormItem>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Property"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}