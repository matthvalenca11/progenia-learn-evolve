import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  ShieldOff, 
  GraduationCap,
  Search,
  Filter,
  UserCog
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const UsersManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<"promote" | "revoke" | "instructor" | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por papel
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.papel === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handlePromoteToAdmin = async () => {
    if (!selectedUser) return;
    
    try {
      await adminService.promoteToAdmin(selectedUser.id);
      toast.success(`${selectedUser.full_name} promovido a Admin!`);
      loadUsers();
    } catch (error) {
      console.error("Erro ao promover:", error);
      toast.error("Erro ao promover usuário");
    } finally {
      setActionDialog(null);
      setSelectedUser(null);
    }
  };

  const handleRevokeAdmin = async () => {
    if (!selectedUser) return;
    
    try {
      await adminService.revokeAdmin(selectedUser.id);
      toast.success(`Admin removido de ${selectedUser.full_name}`);
      loadUsers();
    } catch (error) {
      console.error("Erro ao remover admin:", error);
      toast.error("Erro ao remover admin");
    } finally {
      setActionDialog(null);
      setSelectedUser(null);
    }
  };

  const handlePromoteToInstructor = async () => {
    if (!selectedUser) return;
    
    try {
      await adminService.promoteToInstructor(selectedUser.id);
      toast.success(`${selectedUser.full_name} promovido a Instrutor!`);
      loadUsers();
    } catch (error) {
      console.error("Erro ao promover:", error);
      toast.error("Erro ao promover usuário");
    } finally {
      setActionDialog(null);
      setSelectedUser(null);
    }
  };

  const getRoleBadge = (papel: string) => {
    switch (papel) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>;
      case "instrutor":
        return <Badge className="bg-blue-500">Instrutor</Badge>;
      default:
        return <Badge variant="outline">Aluno</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando usuários...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="aluno">Alunos</SelectItem>
                <SelectItem value="instrutor">Instrutores</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Lista de usuários */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            Usuários ({filteredUsers.length})
          </h3>
        </div>

        {filteredUsers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum usuário encontrado</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCog className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{user.full_name}</h4>
                        {getRoleBadge(user.papel)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        ID: {user.id.substring(0, 8)}...
                      </p>
                      
                      {user.institution && (
                        <p className="text-sm text-muted-foreground">
                          📍 {user.institution}
                        </p>
                      )}
                      
                      {user.user_stats && (
                        <div className="flex gap-4 mt-2 text-xs">
                          <span>⭐ {user.user_stats.total_xp} XP</span>
                          <span>🔥 {user.user_stats.streak_days} dias</span>
                          <span>📚 {user.user_stats.modules_completed} módulos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {user.papel === "aluno" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionDialog("instructor");
                          }}
                        >
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Instrutor
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setActionDialog("promote");
                          }}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Promover Admin
                        </Button>
                      </>
                    )}
                    
                    {user.papel === "instrutor" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionDialog("promote");
                        }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Promover Admin
                      </Button>
                    )}
                    
                    {user.papel === "admin" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionDialog("revoke");
                        }}
                      >
                        <ShieldOff className="h-4 w-4 mr-2" />
                        Remover Admin
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Diálogos de confirmação */}
      <AlertDialog open={actionDialog === "promote"} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promover a Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a promover <strong>{selectedUser?.full_name}</strong> a 
              Administrador. Este usuário terá acesso total à plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePromoteToAdmin}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionDialog === "revoke"} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a remover os privilégios de admin de{" "}
              <strong>{selectedUser?.full_name}</strong>. O usuário voltará a ser aluno.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeAdmin} className="bg-destructive">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionDialog === "instructor"} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promover a Instrutor?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a promover <strong>{selectedUser?.full_name}</strong> a 
              Instrutor. Este usuário poderá criar e editar conteúdo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePromoteToInstructor}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};