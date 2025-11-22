import { Users, Building2, LayoutDashboard, LogOut, Rss } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { message } from "antd";
import { AxiosError } from "axios";
import { mainClient } from "@/store";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "User Inquiries", url: "/admin/users", icon: Users },
  { title: "Properties", url: "/admin/properties", icon: Building2 },
  { title: "Blogs", url: "/admin/blogs", icon: Rss },
];

const logoutItem = { title: "Logout", icon: LogOut };

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await mainClient.request("POST", "/logout", {
        withCredentials: true,
      });

      message.success(response.data?.message || "Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);

      if (err instanceof AxiosError) {
        const msg = err.response?.data?.message || "Logout failed!";
        return message.error(msg);
      }

      message.error("Something went wrong during logout!");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col h-full justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="mb-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-500 w-full text-left"
              >
                <logoutItem.icon className="h-4 w-4" />
                {!collapsed && <span>{logoutItem.title}</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
