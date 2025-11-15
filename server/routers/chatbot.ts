import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { CHATBOT_KNOWLEDGE, SYSTEM_PROMPT } from "../chatbot-knowledge";
import { notifyOwner } from "../_core/notification";

export const chatbotRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string().min(1).max(1000),
        conversationHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ).optional(),
        userEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, conversationHistory = [], userEmail } = input;

      try {
        // Build conversation context
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          {
            role: "system",
            content: `${SYSTEM_PROMPT}\n\nKNOWLEDGE BASE:\n${CHATBOT_KNOWLEDGE}`,
          },
        ];

        // Add conversation history
        conversationHistory.forEach((msg) => {
          messages.push({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          });
        });

        // Add current message
        messages.push({
          role: "user",
          content: message,
        });

        // Get AI response
        const response = await invokeLLM({
          messages,
        });

        const assistantMessage = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

        // Check if this is an out-of-scope question that needs forwarding
        const messageText = typeof assistantMessage === 'string' ? assistantMessage : '';
        const needsForwarding = messageText.toLowerCase().includes("forwarded your inquiry") || 
                                messageText.toLowerCase().includes("i've forwarded");

        // If it needs forwarding, send notification to owner
        if (needsForwarding) {
          const emailContent = `
New chatbot inquiry that requires follow-up:

User Question: ${message}
${userEmail ? `User Email: ${userEmail}` : "User Email: Not provided"}

Conversation History:
${conversationHistory.map((msg, i) => `${i + 1}. ${msg.role === "user" ? "User" : "Bot"}: ${msg.content}`).join("\n")}

Please respond to the user directly via email.
          `;

          await notifyOwner({
            title: "Chatbot Inquiry Requires Follow-up",
            content: emailContent,
          });
        }

        return {
          success: true,
          message: assistantMessage,
          needsEmail: needsForwarding && !userEmail,
        };
      } catch (error) {
        console.error("Chatbot error:", error);
        return {
          success: false,
          message: "I'm having trouble connecting right now. Please try again or contact us directly at support@edolanguageacademy.com",
          needsEmail: false,
        };
      }
    }),

  submitEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        lastQuestion: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, lastQuestion } = input;

      try {
        await notifyOwner({
          title: "Chatbot User Email Submitted",
          content: `
A chatbot user has provided their email for follow-up:

Email: ${email}
Last Question: ${lastQuestion}

Please respond to them directly.
          `,
        });

        return {
          success: true,
          message: "Thank you! We'll get back to you within 24 hours.",
        };
      } catch (error) {
        console.error("Email submission error:", error);
        return {
          success: false,
          message: "There was an error submitting your email. Please contact us directly at support@edolanguageacademy.com",
        };
      }
    }),
});
