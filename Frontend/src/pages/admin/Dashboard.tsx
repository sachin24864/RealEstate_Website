import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, MessageSquare } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { propertyClint } from "../../store/index";

export default function Dashboard() {
  const [inquiriesCount, setInquiriesCount] = useState<number | null>(5);
  const [propertiesCount, setPropertiesCount] = useState<number | null>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await propertyClint.getCount();
        setInquiriesCount(res.data.inquiriesCount);
        setPropertiesCount(res.data.propertiesCount);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your real estate platform</p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold cursor-pointer text-blue-600" onClick={()=>{navigate("/admin/users")}}>
                {loading ? "Loading..." : inquiriesCount}
              </div>
              <p className="text-xs text-muted-foreground">User contact submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold cursor-pointer text-blue-600"  onClick={()=>{navigate("/admin/properties")}}>
                {loading ? "Loading..." : propertiesCount}
              </div>
              <p className="text-xs text-muted-foreground">Listed properties</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
