import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { lazy, Suspense } from "react";

// Lazy load pages to avoid circular dependencies
const Landing = lazy(() => import("@/pages/Landing"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const Auth = lazy(() => import("@/pages/Auth"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Admin = lazy(() => import("@/pages/Admin"));
const Profile = lazy(() => import("@/pages/Profile"));
const ModuleViewer = lazy(() => import("@/pages/ModuleViewer"));
const LessonViewer = lazy(() => import("@/pages/LessonViewer"));
const CapsulasGrid = lazy(() => import("@/pages/CapsulasGrid"));
const CapsulaViewer = lazy(() => import("@/pages/CapsulaViewer"));
const CapsulaBuilder = lazy(() => import("@/components/admin/CapsulaBuilder"));
const VirtualLabEditor = lazy(() => import("@/components/admin/VirtualLabEditor"));
const VirtualLabsAdmin = lazy(() => import("@/pages/VirtualLabsAdmin"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AITutor = lazy(() => import("@/components/AITutor"));

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-background text-foreground safe-area-mobile"
    >
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/module/:moduleId" element={<ModuleViewer />} />
            <Route path="/lesson/:lessonId" element={<LessonViewer />} />
            <Route path="/modulo/:moduleId/capsulas" element={<CapsulasGrid />} />
            <Route path="/capsula/:capsulaId" element={<CapsulaViewer />} />
            <Route path="/admin/capsulas/novo/:moduleId" element={<CapsulaBuilder />} />
            <Route path="/admin/capsulas/editar/:capsulaId" element={<CapsulaBuilder />} />
            <Route path="/admin/labs" element={<VirtualLabsAdmin />} />
            <Route path="/admin/labs/novo" element={<VirtualLabEditor />} />
            <Route path="/admin/labs/editar/:labId" element={<VirtualLabEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
