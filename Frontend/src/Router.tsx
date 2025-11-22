import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";

import Index from "./pages/Index";
import Login from "./pages/login";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import FilterProperties from "./pages/FilterProperties";
import PropertyPage from "./pages/propertyPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";

import ProtectedRoute from "./components/protacted";
import { AdminLayout } from "./components/AdminLayout";
import { AuthProvider } from "./store/app-store/AuthContext";

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Properties = lazy(() => import("./pages/admin/Properties"));
const Blogs = lazy(() => import("./pages/admin/Blogs"));

export default function Router() {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/filter" element={<FilterProperties />} />
              <Route path="/login" element={<Login />} />
              <Route path="/blogs" element={<BlogPage />} />
              <Route path="/projects" element={<Gallery />} />
              <Route path="/property/:id" element={<PropertyPage />} />


              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  element={
                    <AdminLayout>
                      <Outlet />
                    </AdminLayout>
                  }
                >
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/properties" element={<Properties />} />
                  <Route path="/admin/blogs" element={<Blogs />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}
