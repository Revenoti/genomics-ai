import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import openai, { CHAT_MODEL } from "./openai";
import { SYSTEM_PROMPT, shouldTriggerForm } from "./system-prompt";
import { performRAGSearch } from "./supabase";
import { insertLeadSchema, insertMessageSchema } from "@shared/schema";
import type { LeadFormData } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chat endpoint with streaming support
  app.post("/api/chat", async (req, res) => {
    try {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-development') {
        res.status(500).json({ 
          error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables." 
        });
        return;
      }

      const { sessionId, message, messages: messageHistory } = req.body;

      console.log('[CHAT] Incoming request - sessionId:', sessionId, 'messageLength:', message?.length);

      // Validate session
      let session = sessionId ? await storage.getChatSession(sessionId) : null;
      
      if (!session) {
        console.log('[CHAT] Creating new session');
        session = await storage.createChatSession({ turnCount: "0", formSubmitted: "false" });
        console.log('[CHAT] New session created with ID:', session.id);
      } else {
        console.log('[CHAT] Found existing session:', session.id, 'turnCount:', session.turnCount, 'formSubmitted:', session.formSubmitted);
      }

      // Store user message
      await storage.createMessage({
        sessionId: session.id,
        role: "user",
        content: message,
        type: "message",
      });

      // Increment turn count
      const turnCount = parseInt(session.turnCount) + 1;
      console.log('[CHAT] Incrementing turnCount from', session.turnCount, 'to', turnCount);
      await storage.updateChatSession(session.id, {
        turnCount: turnCount.toString(),
      });

      // Check if we should trigger the form
      const formAlreadySubmitted = session.formSubmitted === "true";
      const shouldTrigger = shouldTriggerForm(turnCount, message);
      console.log('[CHAT] Form trigger check - turnCount:', turnCount, 'formAlreadySubmitted:', formAlreadySubmitted, 'shouldTrigger:', shouldTrigger, 'message:', message.substring(0, 50));
      
      if (!formAlreadySubmitted && shouldTrigger) {
        console.log('[CHAT] TRIGGERING FORM - Returning form JSON response');
        // Update session to indicate form should be shown
        await storage.updateChatSession(session.id, {
          metadata: { formTriggered: true } as any,
        });

        // Return form trigger
        res.json({
          type: "form",
          sessionId: session.id,
          message: "To help me provide the best recommendation, I need to gather a little more information. Please fill out the brief form below.",
        });
        return;
      }

      console.log('[CHAT] Not triggering form - proceeding with streaming response');

      // Perform RAG search to get relevant context
      const ragResults = await performRAGSearch(message);
      const contextText = ragResults
        .map((r: any) => r.content || "")
        .join("\n\n");

      // Build conversation history for OpenAI
      const conversationHistory = (messageHistory || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add system prompt with RAG context
      const systemMessage = `${SYSTEM_PROMPT}\n\n## Retrieved Knowledge Base Context:\n${contextText || "No specific context retrieved for this query."}`;

      // Set up SSE headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Stream OpenAI response
      const stream = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: systemMessage },
          ...conversationHistory,
          { role: "user", content: message },
        ],
        stream: true,
        max_completion_tokens: 2048,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content, sessionId: session.id })}\n\n`);
        }
        
        // Check if stream is done
        if (chunk.choices[0]?.finish_reason) {
          break;
        }
      }

      // Store assistant message
      await storage.createMessage({
        sessionId: session.id,
        role: "assistant",
        content: fullResponse,
        type: "message",
      });

      // Send done signal and end stream
      res.write(`data: ${JSON.stringify({ done: true, sessionId: session.id })}\n\n`);
      res.end();

    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Leads submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { sessionId, ...formData } = req.body;

      if (!sessionId) {
        res.status(400).json({ error: "Session ID is required" });
        return;
      }

      // Validate form data using Zod schema (omit sessionId since it's extracted separately)
      const leadFormSchema = insertLeadSchema.omit({ sessionId: true });
      const validatedData = leadFormSchema.parse(formData);

      // Store lead
      const lead = await storage.createLead({
        sessionId,
        ...validatedData,
      });

      // Update session to mark form as submitted
      const updated = await storage.updateChatSession(sessionId, {
        formSubmitted: "true",
      });

      if (!updated) {
        console.error("Failed to update session after lead submission");
      }

      res.json({
        success: true,
        leadId: lead.id,
        message: "Thank you for providing that information. It will help me guide you more effectively.",
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        console.error("Leads API error:", error);
        res.status(500).json({ error: "Failed to submit lead information" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
