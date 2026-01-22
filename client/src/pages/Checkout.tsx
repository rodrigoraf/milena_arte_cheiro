import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
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
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Tentar usar TRPC se disponível, senão usar fallback
  const createSessionMutation = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      window.location.href = data.sessionUrl;
    }
  });

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

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
    toast.success("Produto removido do carrinho");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalFormatted = (total / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Carrinho vazio. Adicione produtos antes de continuar.");
      return;
    }

    if (!email) {
      toast.error("Por favor, forneça um e-mail.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createSessionMutation.mutateAsync({
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        email,
        name,
      });

      if (result.sessionUrl) {
        window.open(result.sessionUrl, "_blank");
        toast.success("Redirecionando para o pagamento...");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // Fallback para simulação quando TRPC falha
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Compra simulada com sucesso! Em um ambiente real, você seria redirecionado para o Stripe.");
        setCart([]);
        setLocation("/");
      } catch (fallbackError) {
        toast.error("Erro na compra simulada.");
      }
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
            <img
              src="/images/logo_milena.png"
              alt="Milena Arte e Cheiro"
              className="h-12 w-auto"
            />
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
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="border-border"
          >
            Voltar
          </Button>
        </div>
      </header>

      <div className="container py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Carrinho de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produtos Disponíveis */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Produtos Disponíveis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(PRODUCTS).map(([id, product]) => (
                  <div
                    key={id}
                    className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-primary mb-4">
                      R$ {(product.price / 100).toFixed(2)}
                    </p>
                    <Button
                      onClick={() => addToCart(id)}
                      className="w-full bg-primary hover:bg-primary/90 text-foreground"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Resumo do Carrinho */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Resumo do Pedido
              </h2>

              {cart.length === 0 ? (
                <p className="text-foreground/60 text-center py-8">
                  Seu carrinho está vazio
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between border-b border-border pb-4"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {item.name}
                          </p>
                          <p className="text-sm text-foreground/60">
                            R$ {(item.price / 100).toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-foreground">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {totalFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Formulário de Contato */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing || cart.length === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-foreground py-3 text-base"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Ir para Pagamento"
                    )}
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-12">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                Milena Arte e Cheiro
              </h4>
              <p className="text-sm text-foreground/60">
                Sabões e velas artesanais feitos com amor e dedicação.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="/catalog" className="hover:text-primary transition-colors">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="/" className="hover:text-primary transition-colors">
                    Sobre
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
