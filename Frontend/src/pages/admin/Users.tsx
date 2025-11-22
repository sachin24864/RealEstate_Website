import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/AdminLayout";
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
import { format } from "date-fns";
import { toast } from "sonner";
import { propertyClint } from "../../store/index";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function Users() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        const response = await propertyClint.getusers();
        console.log(response);
        if (response && Array.isArray(response)) {
          setInquiries(response);
        }
      } catch (error) {
        console.error("Failed to fetch inquiries", error);
        toast.error("Failed to load inquiries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <div>
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
            <CardDescription>View all user contact submissions</CardDescription>
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
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                        <TableCell>{inquiry.email}</TableCell>
                        <TableCell>{inquiry.phone_number}</TableCell>
                        <TableCell>{inquiry.subject}</TableCell>
                        <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(inquiry.created_at), "MMM dd, yyyy")}
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
      </div>
    </div>  
  );
}
