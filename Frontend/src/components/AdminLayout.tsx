import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border flex items-center px-6">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-semibold">Real Estate Admin Dashboard</h1>
          </header>
          <main className="flex-1 p-6 bg-muted/30 overflow-y-auto">
            <div className="max-w-7xl w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
