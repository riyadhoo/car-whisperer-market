
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminStatsOverview } from "@/components/admin/AdminStatsOverview";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { AdminPartsManager } from "@/components/admin/AdminPartsManager";
import { AdminCarsManager } from "@/components/admin/AdminCarsManager";
import { AdminMessagesViewer } from "@/components/admin/AdminMessagesViewer";
import { Users, Car, MessageSquare, Package, Shield } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, loading, createAdminUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Auto-assign admin role to admin@gmail.com
  useEffect(() => {
    if (user && user.email === "admin@gmail.com" && !isAdmin && !loading) {
      createAdminUser();
    }
  }, [user, isAdmin, loading, createAdminUser]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Shield className="h-6 w-6 text-red-500" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              To become an admin, please sign up with: <strong>admin@gmail.com</strong> and password: <strong>admin2025</strong>
            </p>
            <Button onClick={() => window.location.href = "/login"}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "users", label: "Users", icon: Users },
    { id: "parts", label: "Parts", icon: Package },
    { id: "cars", label: "Cars", icon: Car },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminStatsOverview />;
      case "users":
        return <AdminUsersManager />;
      case "parts":
        return <AdminPartsManager />;
      case "cars":
        return <AdminCarsManager />;
      case "messages":
        return <AdminMessagesViewer />;
      default:
        return <AdminStatsOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Badge variant="destructive" className="ml-2">Admin</Badge>
          </div>
          <p className="text-muted-foreground">
            Welcome, {user?.email}. Manage your TorqueUp platform from here.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
