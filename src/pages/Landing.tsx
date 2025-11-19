import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Brain, Award, Users, Microscope, Zap, BookOpen, Trophy, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { PageContainer } from "@/components/layout/PageContainer";

const Landing = () => {
  const features = [
    {
      icon: Brain,
      title: "Tutor de IA",
      description: "Obtenha ajuda personalizada com nosso assistente de IA contextual, disponível 24/7 para responder perguntas e fornecer explicações."
    },
    {
      icon: Microscope,
      title: "Laboratórios Virtuais",
      description: "Explore simuladores interativos que replicam ambientes de laboratório reais para compreensão prática."
    },
    {
      icon: Award,
      title: "Gamificação",
      description: "Ganhe pontos, conquiste badges e acompanhe seu progresso através de um sistema de recompensas envolvente."
    },
    {
      icon: BookOpen,
      title: "Conteúdo Especializado",
      description: "Aprenda através de módulos criados por profissionais especializados cobrindo todas as tecnologias essenciais."
    },
    {
      icon: Trophy,
      title: "Acompanhamento de Progresso",
      description: "Monitore seu aprendizado com análises detalhadas e certificados de conclusão de cada módulo."
    },
    {
      icon: Users,
      title: "Aprendizado Interativo",
      description: "Participe de quizzes, estudos de caso e exercícios práticos para reforçar seu conhecimento."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Mobile Optimized */}
      <nav className="sticky-header-mobile border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <PageContainer maxWidth="2xl" padding="sm">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ProGenia" className="h-8 md:h-10" />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/sobre" className="hidden sm:inline-block">
                <Button variant="ghost" className="text-sm md:text-base">Sobre</Button>
              </Link>
              <Link to="/auth">
                <Button variant="ghost" className="text-sm md:text-base">Entrar</Button>
              </Link>
              <Link to="/auth">
                <Button className="gradient-accent text-white shadow-glow text-sm md:text-base">
                  Começar
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </nav>

      {/* Hero Section - Mobile First */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <PageContainer maxWidth="2xl" padding="lg" className="relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 py-12 md:py-20 lg:py-32">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs md:text-sm font-medium mb-4">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              Plataforma de Aprendizado Científico
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
              Domine a Tecnologia Médica com{" "}
              <span className="text-gradient">ProGenia</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Uma plataforma digital abrangente para profissionais de saúde compreenderem 
              os fundamentos científicos por trás das tecnologias terapêuticas e diagnósticas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 px-4">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gradient-accent text-white shadow-xl hover:shadow-glow transition-smooth text-base md:text-lg px-6 md:px-8">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Começar a Aprender
                </Button>
              </Link>
              <Link to="/sobre" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8">
                  Sobre a ProGenia
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Features Section - Mobile Grid */}
      <section className="py-12 md:py-20 bg-muted/30">
        <PageContainer maxWidth="2xl">
          <div className="text-center mb-8 md:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Por Que Escolher a ProGenia?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Recursos de ponta projetados para a educação médica moderna
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="touch-target hover:shadow-xl transition-smooth border-border/50"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="rounded-lg bg-secondary/10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-secondary" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 md:py-20">
        <PageContainer maxWidth="2xl">
          <Card className="gradient-accent text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 lg:p-16 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Pronto para Transformar Seu Conhecimento Médico?
              </h2>
              <p className="text-base md:text-xl opacity-90 mb-6 md:mb-8 max-w-2xl mx-auto">
                Junte-se a centenas de profissionais de saúde melhorando suas habilidades através da ProGenia
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 shadow-xl">
                  Começar Gratuitamente
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </PageContainer>
      </section>

      {/* Footer - Mobile Friendly */}
      <footer className="border-t bg-muted/30 py-8 md:py-12">
        <PageContainer maxWidth="2xl">
          <div className="text-center space-y-4">
            <img src={logo} alt="ProGenia" className="h-8 md:h-10 mx-auto" />
            <p className="text-sm md:text-base text-muted-foreground">
              © 2024 ProGenia. Todos os direitos reservados.
            </p>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
};

export default Landing;
