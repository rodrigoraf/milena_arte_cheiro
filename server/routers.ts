import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import Stripe from "stripe";
import { PRODUCTS } from "./products";
import { getDb } from "./db";
import { products, cartItems } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Contact form submission
  contact: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          name: z.string().min(2),
          email: z.string().email(),
          phone: z.string().optional(),
          subject: z.string().min(5),
          message: z.string().min(10),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Notify the owner about the new contact message
          const success = await notifyOwner({
            title: `Nova mensagem de contato de ${input.name}`,
            content: `
Nome: ${input.name}
E-mail: ${input.email}
Telefone: ${input.phone || "Não fornecido"}
Assunto: ${input.subject}

Mensagem:
${input.message}
            `,
          });

          if (!success) {
            console.warn("[Contact] Failed to notify owner about message");
            // Still return success to user even if notification fails
          }

          return {
            success: true,
            message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
          };
        } catch (error) {
          console.error("[Contact] Error sending message:", error);
          throw new Error("Erro ao enviar mensagem. Tente novamente.");
        }
      }),
  }),

  // Products router
  products: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(products);
    }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;
        const [product] = await db.select().from(products).where(eq(products.id, input.id));
        return product;
      }),
  }),

  // Cart router
  cart: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          product: products,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, ctx.user.id));
    }),
    add: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const existing = await db
          .select()
          .from(cartItems)
          .where(and(eq(cartItems.userId, ctx.user.id), eq(cartItems.productId, input.productId)));

        if (existing.length > 0) {
          await db
            .update(cartItems)
            .set({ quantity: existing[0].quantity + input.quantity })
            .where(eq(cartItems.id, existing[0].id));
        } else {
          await db.insert(cartItems).values({
            userId: ctx.user.id,
            productId: input.productId,
            quantity: input.quantity,
          });
        }
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(0) }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        if (input.quantity === 0) {
          await db
            .delete(cartItems)
            .where(and(eq(cartItems.userId, ctx.user.id), eq(cartItems.productId, input.productId)));
        } else {
          await db
            .update(cartItems)
            .set({ quantity: input.quantity })
            .where(and(eq(cartItems.userId, ctx.user.id), eq(cartItems.productId, input.productId)));
        }
        return { success: true };
      }),
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));
      return { success: true };
    }),
    createSession: publicProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number().min(1),
            })
          ),
          email: z.string().email().optional(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          // Build line items for Stripe
          const lineItems = await Promise.all(
            input.items.map(async (item) => {
              const [product] = await db.select().from(products).where(eq(products.id, item.productId));
              if (!product) {
                throw new Error(`Produto não encontrado: ${item.productId}`);
              }

              return {
                price_data: {
                  currency: "brl",
                  product_data: {
                    name: product.name,
                    description: product.description || undefined,
                    images: product.image ? [product.image] : [],
                  },
                  unit_amount: product.price,
                },
                quantity: item.quantity,
              };
            })
          );

          // Create checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"] as const,
            line_items: lineItems as any,
            mode: "payment",
            customer_email: input.email || ctx.user?.email || undefined,
            client_reference_id: ctx.user?.id?.toString() || undefined,
            metadata: {
              user_id: ctx.user?.id?.toString() || "guest",
              customer_email: input.email || ctx.user?.email || "",
              customer_name: input.name || ctx.user?.name || "",
            },
            success_url: `${ctx.req.headers.origin || "https://example.com"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${ctx.req.headers.origin || "https://example.com"}/catalog`,
            allow_promotion_codes: true,
          } as any);

          return {
            sessionUrl: session.url,
            sessionId: session.id,
          };
        } catch (error) {
          console.error("[Checkout] Error creating session:", error);
          throw new Error("Erro ao criar sessão de checkout. Tente novamente.");
        }
      }),

    getSession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        try {
          const session = await stripe.checkout.sessions.retrieve(input.sessionId);
          return {
            id: session.id,
            status: session.payment_status,
            customer_email: session.customer_email,
            total: session.amount_total,
            currency: session.currency,
          };
        } catch (error) {
          console.error("[Checkout] Error retrieving session:", error);
          throw new Error("Erro ao recuperar informações da sessão.");
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
