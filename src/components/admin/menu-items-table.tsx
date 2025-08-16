
"use client";

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MenuItem } from '@/types';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { FileEdit, Trash2, Utensils } from 'lucide-react';
import Image from 'next/image';

interface MenuItemsTableProps {
  menuItems: MenuItem[];
}

export default function MenuItemsTable({ menuItems }: MenuItemsTableProps) {
  const { toast } = useToast();

  const handleDelete = async (item: MenuItem) => {
    try {
      // Deleting a local file via a server action would be complex and have
      // security implications. For this simple setup, we'll just delete the
      // Firestore entry. The image file will remain but won't be referenced.
      await deleteDoc(doc(db, 'menuItems', item.id));

      toast({ description: "Menu item deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete menu item." });
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menuItems.map((item) => (
          <TableRow key={item.id}>
             <TableCell>
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <Utensils className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </TableCell>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.category}</Badge>
            </TableCell>
            <TableCell>
                {item.hasHalfQuantity && item.price.half ? `₹${item.price.half.toFixed(2)} (Half) / ` : ''}
                ₹{item.price.full.toFixed(2)} (Full)
            </TableCell>
             <TableCell>
              <Badge variant={item.isAvailable ? "default" : "secondary"}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="icon">
                        <Link href={`/admin/dashboard/edit/${item.id}`}>
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the menu item
                            "{item.name}" and remove its data from our servers. The image file will not be deleted.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item)}>
                            Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
