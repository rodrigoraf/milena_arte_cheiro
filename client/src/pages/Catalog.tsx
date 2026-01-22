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
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const totalPrice = cart.reduce((sum, item) => sum + (item.price / 100), 0);

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

  if (isLoading) {
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
              <Button variant="outline" className="relative">
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
          <h1 className="text-5xl lg:text-6xl text-foreground mb-4">
            Catálogo de Produtos
          </h1>
          <p className="text-lg text-foreground/70">
            Explore nossa coleção completa de sabões e velas artesanais
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="container">
          {!(products || []).length ? (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/60">
                Nenhum produto encontrado. Em breve teremos mais!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(products || []).map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div className="relative bg-muted h-80 flex items-center justify-center overflow-hidden group">
                    <img
                      src={product.image || "/images/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.has(product.id)
                            ? "fill-destructive text-destructive"
                            : "text-foreground/40"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-primary">
                        R$ {(product.price / 100).toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
              <div className="flex gap-2">
                <Button
                  onClick={() => addToCart(product)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-foreground py-3"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
                <a href="/checkout" className="flex-1">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-foreground py-3">
                    Checkout
                  </Button>
                </a>
              </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <section className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
          <div className="container py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total do carrinho:</p>
              <p className="text-2xl font-bold text-primary">
                R$ {totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCart([])}
                className="border-border hover:bg-muted"
              >
                Limpar Carrinho
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-foreground px-8">
                <a href="/contact">Fazer Pedido</a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="container mt-16">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-4xl lg:text-5xl text-foreground mb-6">
            Não encontrou o que procura?
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Temos opções de produtos personalizados. Entre em contato conosco para saber mais!
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-foreground px-10 py-6 text-base">
            <a href="/contact">Solicitar Personalização</a>
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
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/catalog" className="hover:text-primary transition-colors">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-primary transition-colors">
                    Contato
                  </a>
                </li>
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
