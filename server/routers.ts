import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";

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

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
