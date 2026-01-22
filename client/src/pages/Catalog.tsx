import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";


/**
 * Design: Minimalismo Botânico Contemporâneo
 * Página de Catálogo com produtos funcionais
 */

export default function Catalog() {
  const { data: products, isLoading, error } = trpc.products.list.useQuery();
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  
  // Fallback para dados locais se a API falhar
  const fallbackProducts = [
    {
      id: 1,
      name: "Sabonete Azul Tye-Dye",
      description: "Sabonete artesanal com padrão tie-dye em tons de azul. Feito com ingredientes naturais e óleos essenciais puros.",
      price: 1000, // em centavos
      image: "/images/sabonete_azul_tye_dye.png",
    },
    {
      id: 2,
      name: "Sabonete Vermelho do Amor",
      description: "Sabonete artesanal em tons de vermelho com fragrância envolvente. Ideal para presentear ou usar no dia a dia.",
      price: 700, // em centavos
      image: "/images/sabonete_vermelho_do_amor.png",
    },
    {
      id: 3,
      name: "Sabão em forma de coração - azul",
      description: "Sabão artesanal em forma de coração com cor azul turquesa vibrante. Perfeito para presentes especiais.",
      price: 1000, // em centavos
      image: "/images/sabonete_coracao_azul.png",
    },
  ];

  const displayProducts = products || fallbackProducts;
  const isLoadingProducts = isLoading && !products;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product: any) => {
    setCart([...cart, product]);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  if (isLoadingProducts) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <a href="/">
              <img
                src="/images/logo_milena.png"
                alt="Milena Arte e Cheiro"
                className="h-12 w-auto"
              />
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/catalog" className="text-primary font-semibold">
              Catálogo
            </a>
            <a href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contato
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button variant="outline" className="relative" onClick={() => window.location.href = '/checkout'}>
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Catálogo de Produtos
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore nossa coleção de sabões e velas artesanais feitos com amor e ingredientes naturais.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product: any) => (
              <div
                key={product.id}
                className="group border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-muted transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(product.id)
                          ? "fill-primary text-primary"
                          : "text-foreground/40"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-4">
                    {product.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      R$ {(product.price / 100).toFixed(2)}
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-primary hover:bg-primary/90 text-foreground"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Sobre</h4>
              <p className="text-foreground/70 text-sm">
                Milena Arte e Cheiro Ltda. - Produtos artesanais feitos com amor e ingredientes naturais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-foreground/70 hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/catalog" className="text-foreground/70 hover:text-primary transition-colors">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-foreground/70 hover:text-primary transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <p className="text-foreground/70 text-sm">
                E-mail: milena.maaf@gmail.com<br />
                WhatsApp: +55 61 99147-9201<br />
                Águas Claras, Brasília - DF
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2026 Milena Arte e Cheiro Ltda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
