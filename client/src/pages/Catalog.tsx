import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Design: Minimalismo Botânico Contemporâneo
 * Página de Catálogo com produtos funcionais
 */

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "sabonetes" | "velas";
  description: string;
  isFavorite?: boolean;
}

const products: Product[] = [
  {
    id: "1",
    name: "Azul Tye-Dye",
    price: 10.0,
    image: "/images/sabonete_azul_tye_dye.png",
    category: "sabonetes",
    description: "Sabonete artesanal com padrão tie-dye em tons de azul e teal. Feito com óleos essenciais puros.",
    isFavorite: false,
  },
  {
    id: "2",
    name: "Vermelho do Amor",
    price: 7.0,
    image: "/images/sabonete_vermelho_do_amor.png",
    category: "sabonetes",
    description: "Sabonete artesanal em tons vibrantes de vermelho e rosa. Perfeito para presentear quem você ama.",
    isFavorite: false,
  },
];

export default function Catalog() {
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<"todos" | "sabonetes" | "velas">("todos");

  const filteredProducts = selectedCategory === "todos" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
      toast.info("Removido dos favoritos");
    } else {
      newFavorites.add(productId);
      toast.success("Adicionado aos favoritos!");
    }
    setFavorites(newFavorites);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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

      {/* Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Filters */}
      <section className="py-8">
        <div className="container">
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant={selectedCategory === "todos" ? "default" : "outline"}
              onClick={() => setSelectedCategory("todos")}
              className={selectedCategory === "todos" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Todos os Produtos
            </Button>
            <Button
              variant={selectedCategory === "sabonetes" ? "default" : "outline"}
              onClick={() => setSelectedCategory("sabonetes")}
              className={selectedCategory === "sabonetes" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Sabonetes
            </Button>
            <Button
              variant={selectedCategory === "velas" ? "default" : "outline"}
              onClick={() => setSelectedCategory("velas")}
              className={selectedCategory === "velas" ? "bg-primary hover:bg-primary/90" : ""}
            >
              Velas
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/60">
                Nenhum produto encontrado nesta categoria. Em breve teremos mais!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div className="relative bg-muted h-80 flex items-center justify-center overflow-hidden group">
                    <img
                      src={product.image}
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
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-foreground/50">
                        {product.category === "sabonetes" ? "por unidade" : "por vela"}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full bg-primary hover:bg-primary/90 text-foreground py-3"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
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
