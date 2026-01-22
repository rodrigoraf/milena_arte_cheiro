import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const PRODUCTS = {
  SABONETE_AZUL_TYE_DYE: {
    name: "Sabonete Azul Tye-Dye",
    price: 1000,
    image: "/images/sabonete_azul_tye_dye.png",
  },
  SABONETE_VERMELHO_DO_AMOR: {
    name: "Sabonete Vermelho do Amor",
    price: 700,
    image: "/images/sabonete_vermelho_do_amor.png",
  },
  SABAO_CORACAO_AZUL: {
    name: "Sabão em forma de coração - azul",
    price: 1000,
    image: "/images/sabonete_coracao_azul.png",
  },
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const addToCart = (productId: string) => {
    const product = PRODUCTS[productId as keyof typeof PRODUCTS];
    if (!product) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        {
          productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 1200 : 0; // R$ 12.00 de frete
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!email || !name) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setIsProcessing(true);
    try {
      // Simular redirecionamento para checkout
      toast.success("Redirecionando para pagamento...");
      setTimeout(() => {
        window.location.href = "/checkout-success";
      }, 1500);
    } catch (error) {
      toast.error("Erro ao processar checkout");
    } finally {
      setIsProcessing(false);
    }
  };

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
            <a href="/catalog" className="text-foreground hover:text-primary transition-colors">
              Catálogo
            </a>
            <a href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contato
            </a>
          </nav>
        </div>
      </header>

      {/* Checkout Section */}
      <section className="py-12 lg:py-16">
        <div className="container">
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-12">
            Carrinho de Compras
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.length === 0 ? (
                <Card className="p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
                  <p className="text-foreground/60 mb-4">Seu carrinho está vazio</p>
                  <Button onClick={() => setLocation("/catalog")} className="bg-primary hover:bg-primary/90">
                    Continuar Comprando
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.productId} className="p-4 flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-foreground/60 mb-2">
                          R$ {(item.price / 100).toFixed(2)} cada
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          R$ {((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-6">Resumo do Pedido</h2>

                {/* Customer Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">Nome</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">E-mail</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>R$ {(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Frete</span>
                    <span>R$ {(shipping / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span>R$ {(total / 100).toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-foreground"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Finalizar Compra"
                  )}
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="outline"
                  onClick={() => setLocation("/catalog")}
                  className="w-full mt-2"
                >
                  Continuar Comprando
                </Button>
              </Card>
            </div>
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
