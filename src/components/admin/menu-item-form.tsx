
"use client";

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { MenuItem } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadImage } from '@/app/actions';
import Image from 'next/image';
import { Utensils, IndianRupee } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.object({
    full: z.coerce.number().positive({ message: "Full price must be a positive number." }),
    half: z.coerce.number().optional(),
  }),
  hasHalfQuantity: z.boolean().default(false),
  category: z.string().min(2, { message: "Category is required." }),
  isAvailable: z.boolean().default(true),
  image: z.any().optional(),
}).refine(data => {
    if (data.hasHalfQuantity) {
        return data.price.half !== undefined && data.price.half > 0;
    }
    return true;
}, {
    message: "Half price is required when half quantity is enabled.",
    path: ["price.half"],
});

interface MenuItemFormProps {
  initialData?: MenuItem | null;
}

const categories = ["Appetizers", "Main Courses", "Desserts", "Drinks"];

export default function MenuItemForm({ initialData }: MenuItemFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        price: {
            full: initialData.price.full,
            half: initialData.price.half || 0,
        },
        image: undefined,
    } : {
      name: '',
      description: '',
      price: {
          full: 0,
          half: 0,
      },
      hasHalfQuantity: false,
      category: '',
      isAvailable: true,
      image: undefined,
    },
  });

  const hasHalfQuantity = useWatch({
    control: form.control,
    name: "hasHalfQuantity",
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let imageUrl = initialData?.imageUrl || '';
      
      const imageFile = values.image?.[0];
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResult = await uploadImage(formData);

        if (uploadResult.success && uploadResult.imageUrl) {
          imageUrl = uploadResult.imageUrl;
        } else {
          throw new Error(uploadResult.error || 'Image upload failed');
        }
      }
      
      const menuItemData = {
        name: values.name,
        description: values.description,
        price: {
            full: values.price.full,
            ...(values.hasHalfQuantity && { half: values.price.half })
        },
        hasHalfQuantity: values.hasHalfQuantity,
        category: values.category,
        isAvailable: values.isAvailable,
        imageUrl: imageUrl,
      };

      if (initialData) {
        await updateDoc(doc(db, 'menuItems', initialData.id), menuItemData);
        toast({ description: "Menu item updated successfully." });
      } else {
        await addDoc(collection(db, 'menuItems'), menuItemData);
        toast({ description: "Menu item created successfully." });
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
        console.error("Form submission error:", error);
        toast({ variant: "destructive", title: "Error", description: (error as Error).message || "Something went wrong." });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">{initialData ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
         {initialData && (
            <Badge variant={initialData.isAvailable ? "default" : "secondary"}>
                {initialData.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Menu Image</FormLabel>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                           {imagePreview ? (
                              <Image src={imagePreview} alt="Image Preview" fill className="object-cover" />
                           ) : (
                              <Utensils className="h-10 w-10 text-muted-foreground" />
                           )}
                        </div>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                handleImageChange(e);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5}/></FormControl><FormMessage /></FormItem>
                )} />

                <FormField
                    control={form.control}
                    name="hasHalfQuantity"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Enable "Half" Quantity Option
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="price.full" render={({ field }) => (
                        <FormItem><FormLabel>Full Price</FormLabel><FormControl><div className="relative"><IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.01" {...field} className="pl-8" /></div></FormControl><FormMessage /></FormItem>
                    )} />
                    {hasHalfQuantity && (
                        <FormField control={form.control} name="price.half" render={({ field }) => (
                            <FormItem><FormLabel>Half Price</FormLabel><FormControl><div className="relative"><IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="number" step="0.01" {...field} className="pl-8" /></div></FormControl><FormMessage /></FormItem>
                        )} />
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField control={form.control} name="isAvailable" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background"><div className="space-y-0.5"><FormLabel>Item Availability</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                )} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

