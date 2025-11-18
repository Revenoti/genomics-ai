# Functional Genomics AI Chat Interface

## Overview

This is a web application that serves as an AI-powered consultation interface for Functional Genomic Medicine clinic. The application features a landing page with an engaging visual carousel and floating questions that transition users into a conversational AI chat interface. The AI assistant acts as both a medical consultant and sales advisor, helping potential patients understand precision medicine services while qualifying leads through dynamic forms.

The application uses a modern React-based frontend with a Node.js/Express backend, integrating OpenAI's GPT-5 for conversational AI capabilities and Supabase for RAG (Retrieval-Augmented Generation) to provide knowledge-based responses about the clinic's services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool. The application follows a component-based architecture with clear separation between pages and reusable UI components.

**Routing**: Uses Wouter for lightweight client-side routing with two main routes:
- `/` - Landing page with animated service carousel and floating intriguing questions
- `/chat` - Interactive chat interface with the AI assistant

**State Management**: 
- React Context API via `ChatContext` for managing chat state (messages, streaming status, form visibility, session ID)
- TanStack Query for server state management and API data fetching
- Reducer pattern for predictable state updates in the chat interface

**UI Components**: Built using shadcn/ui component library with Radix UI primitives and Tailwind CSS for styling. Design follows a healthcare-focused aesthetic with professional, trust-building visuals.

**Styling System**: 
- Tailwind CSS with custom configuration for healthcare-appropriate color schemes
- Custom CSS variables for theme consistency (gradients, accent colors, borders)
- Typography system using Inter for body text and Sora for headings to convey medical authority

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript

**API Endpoints**:
- `POST /api/chat` - Main chat endpoint with streaming support for AI responses
- Handles session management, message storage, and form triggering logic
- Returns streaming responses for real-time AI conversation or JSON for form triggers

**AI Integration**:
- OpenAI GPT-5 integration via official SDK
- Streaming responses for improved UX during AI generation
- System prompt defines dual role: 50% medical consultant, 50% sales advisor

**RAG System**:
- Supabase integration for knowledge base retrieval
- Performs semantic search against clinic documentation, services, and the Posey Protocol
- Falls back to generic context when Supabase is unavailable or schema doesn't exist
- Includes schema probing on boot to verify database availability

**Session Management**:
- In-memory storage implementation (MemStorage class) for chat sessions, messages, and leads
- Session tracking includes turn count for determining when to trigger lead qualification forms
- Supports migration to database-backed storage (structure ready for Drizzle ORM)

**Form Triggering Logic**:
- Dynamic form appears after 3-5 conversation turns or when user expresses strong interest
- Form captures: name, email, consultation target, primary health concern, previous treatments
- Prevents duplicate form submissions via session tracking

### Data Storage Solutions

**Database Schema** (Drizzle ORM with PostgreSQL):
- `chat_sessions` - Tracks conversation sessions with metadata (turn count, form submission status)
- `messages` - Stores all chat messages with role, content, type, and timestamps
- `leads` - Captures form submissions with user contact info and qualification details

**Current Implementation**: In-memory storage for development/testing
**Production Ready**: Schema defined and migration-ready for PostgreSQL via Drizzle

**Storage Interface Pattern**: IStorage interface allows easy swapping between in-memory and database implementations without changing business logic

### Authentication and Authorization

Currently not implemented. The application is open-access, designed for anonymous lead generation. Session identification uses generated UUIDs without user authentication.

Future consideration: May add authentication for returning users to access conversation history or booked consultations.

### External Dependencies

**OpenAI API**:
- GPT-5 model for conversational AI
- Requires `OPENAI_API_KEY` environment variable
- Handles medical consultation responses and sales guidance

**Supabase**:
- Vector database for RAG knowledge base
- Requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
- Contains clinic documentation, service details, research, and Posey Protocol information
- Expected schema: `documents` table with `content` field and vector embeddings

**Third-Party UI Libraries**:
- Radix UI - Accessible component primitives
- shadcn/ui - Pre-built component library
- TailwindCSS - Utility-first styling
- Lucide React - Icon library

**Form Handling**:
- React Hook Form for form state management
- Zod for schema validation
- @hookform/resolvers for validation integration

**Database Tools**:
- Drizzle ORM for type-safe database operations
- Drizzle Kit for migrations
- @neondatabase/serverless for PostgreSQL connectivity

**Build Tools**:
- Vite for frontend development and building
- esbuild for backend bundling
- tsx for TypeScript execution in development