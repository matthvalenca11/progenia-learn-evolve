import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Brain, Award, Users, Microscope, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="ProGenia" className="h-10" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-accent text-white shadow-glow">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Scientific Learning Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Master Medical Technology with{" "}
              <span className="text-gradient">ProGenia</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive digital learning platform for health professionals to understand 
              the scientific foundations behind therapeutic and diagnostic technologies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth">
                <Button size="lg" className="gradient-accent text-white shadow-xl hover:shadow-glow transition-smooth text-lg px-8">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Explore Modules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose ProGenia?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge features designed for modern medical education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-smooth border-border/50">
              <div className="rounded-lg bg-secondary/10 w-14 h-14 flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI Tutor</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get personalized help with our context-aware AI assistant, available 24/7 to answer questions and provide explanations.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-smooth border-border/50">
              <div className="rounded-lg bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                <Microscope className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Virtual Labs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Experiment with simulated therapeutic parameters and see real-time biological responses in a safe environment.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-smooth border-border/50">
              <div className="rounded-lg bg-secondary/10 w-14 h-14 flex items-center justify-center mb-4">
                <Award className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Gamification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Earn badges, level up, and track your progress as you master each module and achieve learning milestones.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-smooth border-border/50">
              <div className="rounded-lg bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Expert Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn from scientifically accurate, peer-reviewed content covering electrostimulation, imaging, and more.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-smooth border-border/50">
              <div className="rounded-lg bg-secondary/10 w-14 h-14 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor your learning journey with detailed analytics, completion rates, and personalized recommendations.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-smooth border-border/50">
              <div className="rounded-lg bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Interactive Learning</h3>
              <p className="text-muted-foreground leading-relaxed">
                Engage with videos, animations, quizzes, and case studies designed to maximize retention and understanding.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Medical Knowledge?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join ProGenia today and start your journey towards mastering medical technology.
            </p>
            <Link to="/auth">
              <Button size="lg" className="gradient-accent text-white shadow-xl hover:shadow-glow transition-smooth text-lg px-12">
                <GraduationCap className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ProGenia" className="h-8" />
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 ProGenia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;