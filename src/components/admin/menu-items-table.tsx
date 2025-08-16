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
import { db, storage } from '@/lib/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { FileEdit, Trash2 } from 'lucide-react';

interface MenuItemsTableProps {
  menuItems: MenuItem[];
}

export default function MenuItemsTable({ menuItems }: MenuItemsTableProps) {
  const { toast } = useToast();

  const handleDelete = async (item: MenuItem) => {
    try {
      // Delete Firestore document
      await deleteDoc(doc(db, 'menuItems', item.id));

      // Delete image from Storage if it exists
      if (item.imageUrl) {
        try {
            const imageRef = ref(storage, item.imageUrl);
            await deleteObject(imageRef);
        } catch (storageError: any) {
            // It's possible the image doesn't exist or the URL is invalid.
            // We'll log this but not block the deletion of the Firestore entry.
            console.warn("Could not delete image from storage:", storageError.message);
        }
      }
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
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.category}</Badge>
            </TableCell>
            <TableCell>${item.price.toFixed(2)}</TableCell>
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
                            "{item.name}" and remove its data from our servers.
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
