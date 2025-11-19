import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { z } from "zod";
import { PageContainer } from "@/components/layout/PageContainer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Senha deve ter 6+ caracteres").max(100),
  institution: z.string().trim().max(200).optional(),
});

const signInSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    institution: "",
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/dashboard');
      }
    });

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = signUpSchema.parse(signUpData);
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: validated.fullName,
            institution: validated.institution,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("E-mail já registrado. Faça login.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Conta criada! Redirecionando...");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro durante cadastro");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = signInSchema.parse(signInData);
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("E-mail ou senha inválidos");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Bem-vindo de volta!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro durante login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageContainer maxWidth="sm" className="flex-1 flex items-center justify-center py-8">
        <div className="w-full space-y-6">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>

          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="ProGenia" className="h-12 md:h-16 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Bem-vindo à ProGenia</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Faça login ou crie sua conta para começar
            </p>
          </div>

          <Card className="w-full">
            <CardContent className="p-4 md:p-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="touch-target">Entrar</TabsTrigger>
                  <TabsTrigger value="signup" className="touch-target">Cadastrar</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">E-mail</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                        className="touch-target"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Senha</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                        className="touch-target"
                        autoComplete="current-password"
                      />
                    </div>

                    <div className="text-right">
                      <Link to="/forgot-password">
                        <Button variant="link" type="button" className="px-0 text-sm">
                          Esqueceu a senha?
                        </Button>
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full touch-target"
                      disabled={loading}
                    >
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nome Completo</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="João Silva"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        required
                        className="touch-target"
                        autoComplete="name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">E-mail</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                        className="touch-target"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Senha</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                        className="touch-target"
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-institution">Instituição (opcional)</Label>
                      <Input
                        id="signup-institution"
                        type="text"
                        placeholder="Universidade ou Hospital"
                        value={signUpData.institution}
                        onChange={(e) => setSignUpData({ ...signUpData, institution: e.target.value })}
                        className="touch-target"
                        autoComplete="organization"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full touch-target"
                      disabled={loading}
                    >
                      {loading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default Auth;
