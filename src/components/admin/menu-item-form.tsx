"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { MenuItem } from '@/types';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(2, { message: "Category is required." }),
  image: z.any().optional(),
  isAvailable: z.boolean().default(true),
});

interface MenuItemFormProps {
  initialData?: MenuItem | null;
}

export default function MenuItemForm({ initialData }: MenuItemFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        ...initialData,
        image: undefined,
    } : {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: undefined,
      isAvailable: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue('image', file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      let imageUrl = initialData?.imageUrl || '';
      
      if (values.image) {
        const imageRef = ref(storage, `menuItems/${Date.now()}_${values.image.name}`);
        const snapshot = await uploadBytes(imageRef, values.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const menuItemData = {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
        imageUrl,
        isAvailable: values.isAvailable,
      };

      if (initialData) {
        await updateDoc(doc(db, 'menuItems', initialData.id), menuItemData);
        toast({ description: "Menu item updated successfully." });
      } else {
        await addDoc(collection(db, 'menuItems'), menuItemData);
        toast({ description: "Menu item created successfully." });
      }
      router.push('/admin/dashboard');
      router.refresh(); // To reflect changes in the table
    } catch (error) {
        console.error("Form submission error:", error);
        toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{initialData ? 'Edit Menu Item' : 'Add New Menu Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5}/></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-6">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} placeholder="e.g., Appetizers" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="isAvailable" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Available</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                    )} />
                </div>
                <div className="md:col-span-1">
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
                        </FormControl>
                        {imagePreview && (
                            <div className="aspect-square relative w-full rounded-md overflow-hidden border">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
