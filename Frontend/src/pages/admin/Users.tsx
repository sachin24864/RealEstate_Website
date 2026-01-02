import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { propertyClint } from "../../store/index";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  created_at: string;
}

export default function Users() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        const response = await propertyClint.getusers();

        if (Array.isArray(response)) {
          const formattedData = response.map((item: any) => ({
            ...item,
            id: item.id || item._id,
          }));
          setInquiries(formattedData);
          console.log("Fetched inquiries:", formattedData);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load inquiries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;

    try {
      setIsDeleting(true);
      await propertyClint.deleteUser(inquiryToDelete.id);

      setInquiries((prev) =>
        prev.filter((item) => item.id !== inquiryToDelete.id)
      );

      toast.success("Inquiry deleted successfully");
      setInquiryToDelete(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to delete inquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Inquiries</h2>
        <p className="text-muted-foreground">
          Manage contact form submissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
          <CardDescription>
            View all user contact submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : inquiries.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">
                        {inquiry.name}
                      </TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.phone_number}</TableCell>
                      <TableCell>{inquiry.subject}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {inquiry.created_at
                          ? format(
                              new Date(inquiry.created_at),
                              "MMM dd, yyyy"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInquiryToDelete(inquiry)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No inquiries yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!inquiryToDelete}
        onOpenChange={(open) => !open && setInquiryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              inquiry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
