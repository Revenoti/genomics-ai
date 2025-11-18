import { pgTable, text, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Chat Messages Table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  type: text("type"), // 'message' | 'form' | 'typing'
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index("messages_session_id_idx").on(table.sessionId),
}));

// Chat Sessions Table
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  turnCount: text("turn_count").notNull().default("0"),
  formSubmitted: text("form_submitted").notNull().default("false"),
  metadata: jsonb("metadata"), // Store any additional session data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leads Table (Form Submissions)
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  consultationFor: text("consultation_for").notNull(), // 'myself' | 'my-child' | 'my-spouse' | 'other'
  primaryHealthConcern: text("primary_health_concern").notNull(),
  triedOtherTreatments: text("tried_other_treatments").notNull(), // 'yes' | 'no'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod Schemas for Validation
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
}).extend({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  consultationFor: z.enum(["myself", "my-child", "my-spouse", "other"]),
  primaryHealthConcern: z.string().min(10, "Please describe your health concern"),
  triedOtherTreatments: z.enum(["yes", "no"]),
});

// TypeScript Types
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

// Frontend-only types
export type MessageType = 'message' | 'form' | 'typing';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: MessageType;
  timestamp: Date;
}

export interface LeadFormData {
  fullName: string;
  email: string;
  consultationFor: 'myself' | 'my-child' | 'my-spouse' | 'other';
  primaryHealthConcern: string;
  triedOtherTreatments: 'yes' | 'no';
}

export interface ServiceCard {
  id: number;
  title: string;
  description: string;
  image: string;
  question: string;
}
