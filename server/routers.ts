import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import Stripe from "stripe";
import { PRODUCTS } from "./products";

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

  // Checkout and payment routers
  checkout: router({
    createSession: publicProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.string(),
              quantity: z.number().min(1),
            })
          ),
          email: z.string().email().optional(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Build line items for Stripe
          const lineItems = input.items.map((item) => {
            const product = PRODUCTS[item.productId as keyof typeof PRODUCTS];
            if (!product) {
              throw new Error(`Produto não encontrado: ${item.productId}`);
            }

            return {
              price_data: {
                currency: "brl",
                product_data: {
                  name: product.name,
                  description: product.description,
                  images: [product.image],
                },
                unit_amount: product.price,
              },
              quantity: item.quantity,
            };
          });

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
