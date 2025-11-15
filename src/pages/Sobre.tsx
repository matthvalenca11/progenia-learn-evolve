import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  GraduationCap, 
  Lightbulb, 
  Target, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import logo from "@/assets/logo.png";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
}

const Sobre = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    loadPartnersAndTeam();
  }, []);

  const loadPartnersAndTeam = async () => {
    const { data: partnersData } = await supabase
      .from("partners")
      .select("*")
      .order("ordem");
    
    const { data: teamData } = await supabase
      .from("team_members")
      .select("*")
      .order("ordem");

    if (partnersData) setPartners(partnersData);
    if (teamData) setTeam(teamData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="ProGenia" className="h-10" />
            <span className="text-xl font-bold gradient-text">ProGenia</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Entrar
            </Button>
            <Button className="gradient-accent text-white" onClick={() => navigate("/auth")}>
              Criar Conta
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Sobre a ProGenia
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Democratizando o acesso ao conhecimento científico em saúde através de aprendizado 
            interativo, simulações práticas e tecnologia de ponta.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="gradient-accent text-white" onClick={() => navigate("/auth")}>
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")}>
              Explorar Módulos
            </Button>
          </div>
        </div>
      </section>

      {/* Motivação & Problema */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Por Que ProGenia Existe?</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Profissionais de saúde frequentemente utilizam tecnologias terapêuticas e diagnósticas 
                sem compreender profundamente os princípios físicos e fisiológicos por trás delas.
              </p>
              <ul className="space-y-3">
                {[
                  "Lacunas na formação sobre física aplicada à saúde",
                  "Riscos do uso inadequado de eletroterapias e equipamentos",
                  "Recursos de treinamento limitados e fragmentados",
                  "Dificuldade em visualizar conceitos abstratos"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <Target className="h-24 w-24 text-primary opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Solução */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Solução</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ProGenia oferece uma abordagem moderna e eficaz para o aprendizado científico em saúde
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: GraduationCap,
                title: "Micro-Learning Estruturado",
                description: "Conteúdo dividido em módulos curtos e focados, facilitando a absorção do conhecimento"
              },
              {
                icon: Sparkles,
                title: "Simulações Interativas",
                description: "Laboratórios virtuais onde você pode experimentar e visualizar conceitos complexos"
              },
              {
                icon: TrendingUp,
                title: "Aprendizado Personalizado",
                description: "IA que acompanha seu progresso e sugere conteúdos baseados nas suas necessidades"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Learning Journey */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Jornada de Aprendizado</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Fundamentos", desc: "Base teórica essencial" },
                { step: "2", title: "Prática Virtual", desc: "Simulações e labs" },
                { step: "3", title: "Avaliação", desc: "Quizzes e casos clínicos" },
                { step: "4", title: "Certificação", desc: "Reconhecimento oficial" }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Público-alvo & Impacto */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quem se Beneficia?</h2>
            <p className="text-lg text-muted-foreground">
              ProGenia foi desenvolvido para profissionais e estudantes da área da saúde
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "👨‍⚕️", title: "Fisioterapeutas", count: "5.000+" },
              { icon: "👩‍🎓", title: "Estudantes", count: "2.000+" },
              { icon: "🏥", title: "Profissionais", count: "3.000+" }
            ].map((audience, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="text-5xl mb-3">{audience.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{audience.title}</h3>
                <p className="text-3xl font-bold text-primary">{audience.count}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros & Apoiadores */}
      {partners.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Parceiros & Apoiadores</h2>
              <p className="text-lg text-muted-foreground">
                Orgulhosos de contar com o apoio de instituições de excelência
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <Card key={partner.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                  {partner.logo_url && (
                    <div className="h-20 flex items-center justify-center mb-4">
                      <img 
                        src={partner.logo_url} 
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
                  {partner.description && (
                    <p className="text-sm text-muted-foreground">{partner.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Equipe */}
      {team.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
              <p className="text-lg text-muted-foreground">
                Especialistas dedicados a revolucionar a educação em saúde
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.id} className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {member.photo_url ? (
                      <img 
                        src={member.photo_url} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  {member.bio && (
                    <p className="text-xs text-muted-foreground">{member.bio}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visão & Roadmap */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visão de Futuro</h2>
            <p className="text-lg text-muted-foreground">
              Estamos constantemente evoluindo e expandindo nossa plataforma
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: "Laboratórios Avançados", desc: "Simulações 3D de equipamentos e procedimentos", status: "Em breve" },
              { title: "Módulos de Imagem Médica", desc: "Ultrassom, TC e RM com casos reais", status: "2024" },
              { title: "Personalização por IA", desc: "Trilhas adaptativas baseadas no seu perfil", status: "2024" },
              { title: "Certificações Internacionais", desc: "Reconhecimento global do aprendizado", status: "2025" }
            ].map((item, i) => (
              <Card key={i} className="p-6 flex items-center gap-6">
                <div className="text-4xl font-bold text-primary/20">{i + 1}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-secondary/20 text-secondary font-medium text-sm">
                  {item.status}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Transformar Seu Aprendizado?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de profissionais que já estão evoluindo com a ProGenia
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="gradient-accent text-white" onClick={() => navigate("/auth")}>
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Fale Conosco
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>© 2024 ProGenia - Learn & Evolve. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Sobre;