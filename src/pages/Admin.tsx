import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  BookOpen, 
  Users, 
  BarChart, 
  Settings,
  Home,
  Save
} from "lucide-react";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { z } from "zod";

const moduleSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
  category: z.string().trim().min(2).max(100),
  estimated_hours: z.number().min(1).max(100),
  difficulty_level: z.string(),
});

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<any[]>([]);
  
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    category: "",
    difficulty_level: "intermediate",
    estimated_hours: 5,
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const hasAdminRole = roles?.some(r => r.role === "admin");
      
      if (!hasAdminRole) {
        toast.error("Admin access required");
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      loadModules();
      setLoading(false);
    };

    checkAdminAccess();
  }, [navigate]);

  const loadModules = async () => {
    const { data } = await supabase
      .from("modules")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setModules(data);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = moduleSchema.parse(newModule);
      
      const { error } = await supabase
        .from("modules")
        .insert({
          title: validated.title,
          description: validated.description,
          category: validated.category,
          difficulty_level: validated.difficulty_level,
          estimated_hours: validated.estimated_hours,
          order_index: modules.length,
          published: false,
        });

      if (error) throw error;

      toast.success("Module created successfully!");
      setNewModule({
        title: "",
        description: "",
        category: "",
        difficulty_level: "intermediate",
        estimated_hours: 5,
      });
      loadModules();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to create module");
      }
    }
  };

  const toggleModulePublish = async (moduleId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("modules")
      .update({ published: !currentStatus })
      .eq("id", moduleId);

    if (error) {
      toast.error("Failed to update module");
    } else {
      toast.success(currentStatus ? "Module unpublished" : "Module published");
      loadModules();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ProGenia" className="h-10" />
            <span className="text-sm font-medium text-muted-foreground">Admin Panel</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your learning platform content
          </p>
        </div>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="modules">
              <BookOpen className="mr-2 h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            {/* Create Module Form */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Plus className="h-6 w-6" />
                Create New Module
              </h2>
              
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Module Title</Label>
                    <Input
                      id="title"
                      value={newModule.title}
                      onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                      placeholder="e.g., Electrostimulation Fundamentals"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newModule.category}
                      onChange={(e) => setNewModule({ ...newModule, category: e.target.value })}
                      placeholder="e.g., Electrotherapy"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newModule.description}
                    onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    placeholder="Describe what students will learn..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={newModule.difficulty_level}
                      onValueChange={(value) => setNewModule({ ...newModule, difficulty_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Estimated Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="1"
                      max="100"
                      value={newModule.estimated_hours}
                      onChange={(e) => setNewModule({ ...newModule, estimated_hours: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="gradient-accent text-white">
                  <Save className="mr-2 h-4 w-4" />
                  Create Module
                </Button>
              </form>
            </Card>

            {/* Existing Modules */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Existing Modules ({modules.length})</h2>
              
              {modules.length === 0 ? (
                <Card className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Modules Yet</h3>
                  <p className="text-muted-foreground">
                    Create your first learning module to get started
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {modules.map((module) => (
                    <Card key={module.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{module.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              module.published 
                                ? "bg-secondary/10 text-secondary" 
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {module.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-2">{module.description}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>📚 {module.category}</span>
                            <span>⏱️ {module.estimated_hours}h</span>
                            <span>📊 {module.difficulty_level}</span>
                          </div>
                        </div>
                        <Button
                          variant={module.published ? "outline" : "default"}
                          onClick={() => toggleModulePublish(module.id, module.published)}
                        >
                          {module.published ? "Unpublish" : "Publish"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground">
                User management features coming soon
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-12 text-center">
              <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Platform Analytics</h3>
              <p className="text-muted-foreground">
                Analytics dashboard coming soon
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-12 text-center">
              <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Platform Settings</h3>
              <p className="text-muted-foreground">
                Configuration options coming soon
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
