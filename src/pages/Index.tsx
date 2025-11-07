import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, Brain, Leaf, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background z-10" />
        <img
          src={heroImage}
          alt="Smart Agriculture"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        
        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-primary/10 backdrop-blur-sm">
              <Sprout className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            CropBot
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto animate-fade-in">
            Smart Agriculture AI Assistant
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            Get intelligent crop recommendations powered by machine learning. Analyze soil parameters, 
            environmental conditions, and receive expert farming insights with visual crop guides.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 shadow-medium hover:shadow-glow transition-all"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Powered by Advanced Technology
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover-scale">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Machine Learning</h3>
              <p className="text-muted-foreground">
                Advanced ML models trained on comprehensive datasets to provide accurate crop recommendations 
                with ~99% accuracy.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover-scale">
              <div className="p-3 rounded-xl bg-accent/20 w-fit mb-4">
                <Leaf className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Multi-Factor Analysis</h3>
              <p className="text-muted-foreground">
                Analyzes soil nutrients (N, P, K, pH), temperature, humidity, and rainfall to recommend 
                the best crops for your conditions.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover-scale">
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Expert Insights</h3>
              <p className="text-muted-foreground">
                Receive detailed crop information with visual guides, growing tips, and farming best 
                practices tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Optimize Your Farming?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join CropBot today and start making data-driven decisions for better crop yields.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 shadow-medium hover:shadow-glow transition-all"
          >
            Start Free Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 CropBot. Empowering farmers with AI technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
