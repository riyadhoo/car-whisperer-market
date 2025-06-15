
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPartsManager } from "@/components/admin/AdminPartsManager";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { AdminCarsManager } from "@/components/admin/AdminCarsManager";
import { AdminMessagesViewer } from "@/components/admin/AdminMessagesViewer";
import { AdminStatsOverview } from "@/components/admin/AdminStatsOverview";
import Navbar from "@/components/layout/Navbar";
import { Shield, Users, Car, Wrench, MessageSquare, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, createAdminUser } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // Auto-create admin role for admin@gmail.com
    if (user?.email === "admin@gmail.com" && !adminLoading && !isAdmin) {
      createAdminUser();
    }
  }, [user, adminLoading, isAdmin, createAdminUser]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-foreground">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have admin privileges to access this dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl py-10 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-automotive-red" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all aspects of your TorqueUp platform
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="parts" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Parts
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Cars
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminStatsOverview />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersManager />
          </TabsContent>

          <TabsContent value="parts">
            <AdminPartsManager />
          </TabsContent>

          <TabsContent value="cars">
            <AdminCarsManager />
          </TabsContent>

          <TabsContent value="messages">
            <AdminMessagesViewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
