import { relations } from "drizzle-orm";
import { users, products, cartItems } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
