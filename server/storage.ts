import { 
  type ChatSession,
  type InsertChatSession,
  type Message,
  type InsertMessage,
  type Lead,
  type InsertLead,
  chatSessions,
  messages as messagesTable,
  leads as leadsTable
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db, isDatabaseConfigured } from './db';
import { eq, asc } from 'drizzle-orm';

export interface IStorage {
  // Chat Sessions
  createChatSession(session: Partial<InsertChatSession>): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySession(sessionId: string): Promise<Message[]>;
  
  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadsBySession(sessionId: string): Promise<Lead[]>;
}

export class MemStorage implements IStorage {
  private chatSessions: Map<string, ChatSession>;
  private messages: Map<string, Message>;
  private leads: Map<string, Lead>;

  constructor() {
    this.chatSessions = new Map();
    this.messages = new Map();
    this.leads = new Map();
  }

  // Chat Sessions
  async createChatSession(insertSession: Partial<InsertChatSession>): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      id,
      turnCount: insertSession.turnCount || "0",
      formSubmitted: insertSession.formSubmitted || "false",
      metadata: insertSession.metadata || null,
      createdAt: now,
      updatedAt: now,
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    const session = this.chatSessions.get(id);
    if (!session) return undefined;
    
    const updated: ChatSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.chatSessions.set(id, updated);
    return updated;
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      ...insertMessage,
      type: insertMessage.type || null,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // Leads
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = {
      id,
      ...insertLead,
      createdAt: new Date(),
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getLeadsBySession(sessionId: string): Promise<Lead[]> {
    return Array.from(this.leads.values())
      .filter(lead => lead.sessionId === sessionId);
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // Chat Sessions
  async createChatSession(insertSession: Partial<InsertChatSession>): Promise<ChatSession> {
    if (!db) throw new Error('Database not configured');
    
    // Build the values object, omitting metadata if it's not provided
    const values: any = {
      turnCount: insertSession.turnCount || "0",
      formSubmitted: insertSession.formSubmitted || "false",
    };
    
    // Only include metadata if it exists and is not null
    if (insertSession.metadata !== undefined && insertSession.metadata !== null) {
      values.metadata = insertSession.metadata;
    }
    
    console.log('[DatabaseStorage] Creating session with values:', values);
    
    // Using neon-serverless driver which fully supports .returning()
    const result = await db
      .insert(chatSessions)
      .values(values)
      .returning();
    
    console.log('[DatabaseStorage] Insert result:', result);
    
    const [session] = result;
    if (!session) {
      throw new Error('Failed to create chat session - no result returned from database');
    }
    
    console.log('[DatabaseStorage] Created session:', session.id);
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    if (!db) throw new Error('Database not configured');
    
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, id))
      .limit(1);
    
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession | undefined> {
    if (!db) throw new Error('Database not configured');
    
    const [updated] = await db
      .update(chatSessions)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(chatSessions.id, id))
      .returning();
    
    return updated;
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    if (!db) throw new Error('Database not configured');
    
    const [message] = await db.insert(messagesTable).values({
      ...insertMessage,
      type: insertMessage.type || null,
    }).returning();
    
    return message;
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    if (!db) throw new Error('Database not configured');
    
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.sessionId, sessionId))
      .orderBy(asc(messagesTable.createdAt));
    
    return messages;
  }

  // Leads
  async createLead(insertLead: InsertLead): Promise<Lead> {
    if (!db) throw new Error('Database not configured');
    
    const [lead] = await db.insert(leadsTable).values(insertLead).returning();
    
    return lead;
  }

  async getLeadsBySession(sessionId: string): Promise<Lead[]> {
    if (!db) throw new Error('Database not configured');
    
    const leads = await db
      .select()
      .from(leadsTable)
      .where(eq(leadsTable.sessionId, sessionId));
    
    return leads;
  }
}

// Export the appropriate storage implementation
// Use DatabaseStorage if database is configured, otherwise fall back to MemStorage
export const storage: IStorage = isDatabaseConfigured() 
  ? new DatabaseStorage() 
  : new MemStorage();

console.log(`[STORAGE] Using ${isDatabaseConfigured() ? 'DatabaseStorage (PostgreSQL)' : 'MemStorage (in-memory)'}`);

