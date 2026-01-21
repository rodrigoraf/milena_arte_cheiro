import { db } from "./server/db";
import { products } from "./drizzle/schema";

const seedProducts = [
  {
    name: "Sabonete Azul Tye-Dye",
    description: "Sabonete artesanal com padrão tie-dye em tons de azul. Feito com ingredientes naturais e óleos essenciais puros.",
    price: 1000, // R$ 10.00
    image: "/images/sabonete_azul_tye_dye.png",
  },
  {
    name: "Sabonete Vermelho do Amor",
    description: "Sabonete artesanal em tons de vermelho com fragrância envolvente. Ideal para presentear ou usar no dia a dia.",
    price: 700, // R$ 7.00
    image: "/images/sabonete_vermelho_do_amor.png",
  },
];

async function seed() {
  console.log("Seeding products...");
  for (const product of seedProducts) {
    await db.insert(products).values(product);
  }
  console.log("Seeding completed!");
  process.exit(0);
}

seed().catch(console.error);