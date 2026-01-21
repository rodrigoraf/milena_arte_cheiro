/**
 * Product definitions for Stripe integration
 * These products are used to create checkout sessions
 */

export const PRODUCTS = {
  SABONETE_AZUL_TYE_DYE: {
    name: "Sabonete Azul Tye-Dye",
    description: "Sabonete artesanal com padrão tie-dye em tons de azul. Feito com ingredientes naturais e óleos essenciais puros.",
    price: 1000, // R$ 10.00 em centavos
    image: "/images/sabonete_azul_tye_dye.png",
  },
  SABONETE_VERMELHO_DO_AMOR: {
    name: "Sabonete Vermelho do Amor",
    description: "Sabonete artesanal em tons de vermelho com fragrância envolvente. Ideal para presentear ou usar no dia a dia.",
    price: 700, // R$ 7.00 em centavos
    image: "/images/sabonete_vermelho_do_amor.png",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

export function getProductByKey(key: ProductKey) {
  return PRODUCTS[key];
}

export function getAllProducts() {
  return Object.entries(PRODUCTS).map(([key, product]) => ({
    id: key,
    ...product,
  }));
}
