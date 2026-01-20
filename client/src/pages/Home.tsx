import { Button } from "@/components/ui/button";
import { Heart, Leaf, Sparkles } from "lucide-react";

/**
 * Design: Minimalismo Botânico Contemporâneo
 * Tipografia: Playfair Display (títulos) + Lato (corpo)
 * Cores: Rosa pálido, branco, verde sálvia, marrom quente
 * Layout: Grid assimétrico com espaço negativo generoso
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo_milena.png"
              alt="Milena Arte e Cheiro"
              className="h-12 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#produtos" className="text-foreground hover:text-primary transition-colors">
              Produtos
            </a>
            <a href="#sobre" className="text-foreground hover:text-primary transition-colors">
              Sobre
            </a>
            <a href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contato
            </a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-foreground">
            <a href="/contact">Saiba Mais</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl text-foreground leading-tight">
                Aromas que
                <span className="block text-primary">Contam Histórias</span>
              </h1>
              <p className="text-lg text-foreground/70 leading-relaxed max-w-md">
                Sabões e velas artesanais feitos com amor e dedicação. Cada produto é uma celebração da natureza e da criatividade.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-foreground px-8 py-6 text-base">
                <a href="#produtos">Explorar Coleção</a>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-muted px-8 py-6 text-base"
              >
                <a href="/contact">Fale Conosco</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-secondary" />
                <span className="text-sm text-foreground/60">100% Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground/60">Artesanal</span>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative h-96 lg:h-full min-h-96 rounded-lg overflow-hidden">
            <img
              src="/images/hero_soap_candles.png"
              alt="Sabões e velas artesanais"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Produtos Section */}
      <section id="produtos" className="py-20 lg:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-foreground mb-4">
              Nossa Coleção
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Cada produto é cuidadosamente elaborado com ingredientes naturais e essências selecionadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Produto 1: Sabão */}
            <div className="group">
              <div className="relative h-96 rounded-lg overflow-hidden mb-6 bg-muted">
                <img
                  src="/images/soap_product.png"
                  alt="Sabão Artesanal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl text-foreground">Sabões Artesanais</h3>
                <p className="text-foreground/60 leading-relaxed">
                  Sabonetes feitos à mão com óleos essenciais puros e ingredientes naturais. Cada barra é única e traz benefícios para sua pele.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/50">Cuidado com a pele</span>
                </div>
              </div>
            </div>

            {/* Produto 2: Vela */}
            <div className="group">
              <div className="relative h-96 rounded-lg overflow-hidden mb-6 bg-muted">
                <img
                  src="/images/candle_product.png"
                  alt="Vela Aromática"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl text-foreground">Velas Aromáticas</h3>
                <p className="text-foreground/60 leading-relaxed">
                  Velas perfumadas com fragrâncias sofisticadas que transformam qualquer ambiente. Feitas com cera natural e flores prensadas.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground/50">Ambiente acolhedor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Sobre Section */}
      <section id="sobre" className="py-20 lg:py-32 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-4xl lg:text-5xl text-foreground mb-8">
            Sobre Milena Arte e Cheiro
          </h2>
          <div className="space-y-6 text-lg text-foreground/70 leading-relaxed">
            <p>
              Milena Arte e Cheiro Ltda. é uma pequena manufatura dedicada à criação de produtos artesanais de alta qualidade. Cada sabão e vela é produzido com atenção aos detalhes e respeito aos ingredientes naturais.
            </p>
            <p>
              Acreditamos que a beleza e o bem-estar começam com produtos autênticos, feitos sem pressa. Nossas criações combinam técnicas tradicionais com ingredientes contemporâneos para oferecer uma experiência sensorial única.
            </p>
            <p>
              Desde o primeiro aroma até o último toque, cada produto reflete nossa paixão pela excelência artesanal e pela sustentabilidade.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl lg:text-5xl text-foreground mb-6">
            Pronto para Descobrir?
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Explore nossa coleção completa e encontre o aroma perfeito para você.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-foreground px-10 py-6 text-base">
            <a href="/contact">Entrar em Contato</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Milena Arte e Cheiro</h4>
              <p className="text-sm text-foreground/60">
                Sabões e velas artesanais feitos com amor e dedicação.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#produtos" className="hover:text-primary transition-colors">Produtos</a></li>
                <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <p className="text-sm text-foreground/60">
                Email: milena.maaf@gmail.com
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-foreground/50">
              © 2026 Milena Arte e Cheiro Ltda. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
