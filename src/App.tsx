import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Landing from "@/pages/Landing";
import Sobre from "@/pages/Sobre";
import Auth from "@/pages/Auth";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import ModuleViewer from "@/pages/ModuleViewer";
import LessonViewer from "@/pages/LessonViewer";
import CapsulasGrid from "@/pages/CapsulasGrid";
import CapsulaViewer from "@/pages/CapsulaViewer";
import CapsulaBuilder from "@/components/admin/CapsulaBuilder";
import VirtualLabEditor from "@/components/admin/VirtualLabEditor";
import VirtualLabsAdmin from "@/pages/VirtualLabsAdmin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground safe-area-mobile">
      <main className="flex-1 flex flex-col overflow-y-auto">
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
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
