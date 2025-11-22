import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { AddPropertyDialog } from "@/components/AddPropertyDialog";
import { EditPropertyDialog } from "@/components/EditPropertyDialog";
import { propertyClint } from "../../store/index";

export default function Properties() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await propertyClint.getProperties();

        const formattedData = data.map((p: any) => ({
          id: p.id || p._id,
          title: p.title,
          price: p.price || p.Price,
          location: p.location || p.Location,
          property_type: p.property_type || p.Type,
          bedrooms: p.bedrooms || p.Beds,
          bathrooms: p.bathrooms || p.Baths,
          area_sqft: p.area_sqft,
          status: p.status || p.Status,
          images: p.images || [],
          createdAt: p.createdAt,
        }));

        setProperties(formattedData);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleAddProperty = (newProperty: any) => {
    const formattedProperty = {
      id: newProperty._id || newProperty.id,
      title: newProperty.title,
      price: newProperty.price,
      location: newProperty.location,
      property_type: newProperty.property_type,
      bedrooms: newProperty.bedrooms,
      bathrooms: newProperty.bathrooms,
      area_sqft: newProperty.area_sqft,
      status: newProperty.status,
      images: newProperty.images || [],
      createdAt: newProperty.createdAt,
    };

    setProperties((prev) => [formattedProperty, ...prev]);
    toast.success("Property added successfully!");
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await propertyClint.deletepro(id);
      setProperties((prev) => prev.filter((prop) => prop.id !== id));
      toast.success("Property deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete property");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (property: any) => {
    setEditProperty(property);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProperty = (updatedProperty: any) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === updatedProperty.id
          ? { ...prop, ...updatedProperty } 
          : prop
      )
    );
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Properties</CardTitle>
            <CardDescription>View, add, edit, and delete property listings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : properties.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Beds</TableHead>
                      <TableHead>Baths</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property: any) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>₹{property.price?.toLocaleString()}</TableCell>
                        <TableCell className="capitalize">{property.property_type}</TableCell>
                        <TableCell>{property.bedrooms || "N/A"}</TableCell>
                        <TableCell>{property.bathrooms || "N/A"}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              property.status === "Ready_to_Move"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {property.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(property)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            disabled={isDeleting === property.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No properties yet. Add your first property!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddPropertyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddProperty}
      />

      <EditPropertyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        property={editProperty}
        onUpdate={handleUpdateProperty}
      />
    </div>
  );
}
