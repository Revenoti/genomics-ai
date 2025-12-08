# Functional Genomics AI Chat Interface

## Overview

This is a web application that serves as an AI-powered consultation interface for Functional Genomic Medicine clinic. The project is source-controlled on GitHub with comprehensive documentation in README.md. The application features a landing page with an engaging visual carousel and floating questions that transition users into a conversational AI chat interface. The AI assistant acts as both a medical consultant and sales advisor, helping potential patients understand precision medicine services while qualifying leads through dynamic forms.

The application uses a modern React-based frontend with a Node.js/Express backend, integrating OpenAI's GPT-5-mini for conversational AI capabilities (optimized for speed) and Supabase for RAG (Retrieval-Augmented Generation) to provide knowledge-based responses about the clinic's services.

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

**Rich Text Chat Rendering**:
- ReactMarkdown with remark-gfm for full markdown support including auto-linking URLs
- Custom styled components: headings, blockquotes, code blocks, lists
- Links styled with primary color, underline, and external link icon (ExternalLink from lucide-react)
- All external links open in new tab (target="_blank")

**Styling System**: 
- Tailwind CSS with custom configuration for healthcare-appropriate color schemes
- **Color Scheme**: Blue-cyan primary color (HSL 195, 60%, 38% light mode / 48% dark mode) - a bluer variant inspired by the clinic's logo
- Custom CSS variables for theme consistency (gradients, accent colors, borders)
- Typography system using Inter for body text and Sora for headings to convey medical authority

**Branding**:
- Clinic logo (`logo2_1763479558697.png`) - Enhanced transparent logo with colorful DNA helix, green leaves, and circular rainbow gradient
- Landing page: Logo positioned absolutely with z-index for visibility over gradient background
- Chat header: Logo integrated into sticky header, clickable to return to home page
- Responsive sizing: 48px mobile / 64px desktop (landing), 40px mobile / 48px desktop (chat)
- Logo publicly accessible at `/logo2_1763479558697.png` for Open Graph social sharing
- Favicon: Uses clinic logo for browser tab branding

**SEO & Social Sharing**:
- Custom domain: genomic-ai.io
- Custom 1200x630px branded Open Graph card (`client/public/social/og-card.png`)
  - Professional blue-cyan gradient background matching app design
  - DNA helix branding with clinic name and tagline
  - Optimized for Facebook, LinkedIn, Twitter, and WhatsApp
- Open Graph meta tags with CRO-optimized marketing copy
- Twitter Card integration for enhanced social media previews
- Additional meta tags: og:image:type, og:image:secure_url for enhanced compatibility

**Asset Handling**:
- All static assets (images, logos) imported using Vite's `@assets` alias
- Carousel service images use import-based approach for proper bundling and optimization
- Asset imports ensure proper cache-busting and production build optimization

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript

**API Endpoints**:
- `POST /api/chat` - Main chat endpoint with streaming support for AI responses
  - Handles session management, message storage, and form triggering logic
  - Returns streaming responses for real-time AI conversation or JSON for form triggers
- `GET /api/sessions/:sessionId/messages` - Fetch complete message history for a session
  - Used on page load to restore conversation after refresh
  - Returns session metadata (turnCount, formSubmitted) and all messages
- `POST /api/leads` - Submit lead qualification form data

**AI Integration**:
- OpenAI GPT-5-mini integration via official SDK (optimized for 2-3x faster responses than GPT-5)
- **Performance optimizations**: 
  - max_completion_tokens: 1024 (balanced for complete responses)
  - System prompt optimized to ~250 tokens (reduced from ~1300 for faster TTFT)
  - Performance logging: Time to first token (TTFT) and total response time
- **Streaming Mode**: Real-time SSE (Server-Sent Events) for typewriter effect
  - Full streaming support for Railway deployment (no serverless timeout limits)
  - X-Accel-Buffering header disabled for proper streaming through proxies
- System prompt defines dual role: 50% medical consultant, 50% sales advisor
- **Clinic Information**: AI assistant is aware of:
  - Physical Address: 1217 Sovereign Row, Suite 107, Oklahoma City, OK 73108
  - Scheduling URL: https://functionalgenomicmedicine.com/calendar
  - AI directs all appointment scheduling to the calendar URL
- **Reliability Features**:
  - 30-second connection timeout (allows OpenAI time to start responding)
  - Timeout cleared after headers received (allows indefinite streaming)
  - Exponential backoff retry strategy (max 2 retries: 1s, 2s delays)
  - Proper SSE chunk buffering to handle split events across network boundaries
  - Enhanced loading indicator: "AI is analyzing your question..." with spinner
  - Graceful error messages for timeout/network failures

**RAG System**:
- Supabase integration for knowledge base retrieval
- Performs semantic search against clinic documentation, services, and the Posey Protocol
- Falls back to generic context when Supabase is unavailable or schema doesn't exist
- Includes schema probing on boot to verify database availability

**Session Management**:
- **DATABASE PERSISTENCE** (when DATABASE_URL is set): Full PostgreSQL implementation using Supabase with Drizzle ORM
- **FALLBACK MODE** (without DATABASE_URL): In-memory storage (MemStorage) - data lost on server restart
- SessionId stored in browser localStorage (`genomic-ai-session-id`) for cross-refresh persistence
- Automatic session restoration on page load with complete message history (if database is configured)
- Session tracking includes turn count for determining when to trigger lead qualification forms
- Form visibility state restored after page refresh via localStorage
- All conversations, form submissions, and user data persisted to database for analytics (when configured)

**Form Triggering Logic**:
- Dynamic form appears after 3-5 conversation turns or when user expresses strong interest
- Form captures: name, email, consultation target, primary health concern, previous treatments
- Prevents duplicate form submissions via session tracking

### Data Storage Solutions

**Database Schema** (Drizzle ORM with PostgreSQL):
- `chat_sessions` - Tracks conversation sessions with metadata (turn count, form submission status)
- `messages` - Stores all chat messages with role, content, type, and timestamps
- `leads` - Captures form submissions with user contact info and qualification details

**Current Implementation**: Automatic selection between DatabaseStorage (when DATABASE_URL is set) and MemStorage (fallback)
**Database Driver**: neon-serverless with WebSocket support for full PostgreSQL compatibility
**Performance Optimization**: Index on `messages.session_id` for efficient history queries when using database
**Note**: For production deployments, DATABASE_URL must be set to enable persistence across server restarts

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

### Deployment

**Primary Deployment (Railway)**: 
- Optimized for Railway deployment from GitHub
- Full streaming support for real-time AI responses (no timeout limits)
- `railway.json` and `nixpacks.toml` configuration files included
- Health check endpoint at `/api/health` for Railway monitoring
- Environment variables configured in Railway dashboard

**Railway Deployment Steps**:
1. Push code to GitHub repository
2. Create new project on Railway (railway.app)
3. Select "Deploy from GitHub repo"
4. Configure environment variables in Railway dashboard:
   - `OPENAI_API_KEY` - OpenAI API key
   - `DATABASE_URL` - Supabase PostgreSQL connection string
   - `SUPABASE_URL` - Supabase project URL
   - `SUPABASE_ANON_KEY` - Supabase anonymous key
   - `SESSION_SECRET` - Random string for session encryption
5. Railway automatically builds and deploys on each push

**Performance Optimizations**:
- Full SSE streaming for real-time AI responses
- Optimized token limits (1024 max tokens) for faster responses
- X-Accel-Buffering header disabled for proper streaming through proxies
- Health check endpoint for Railway monitoring and auto-restart

**Alternative Deployments**: 
- Replit with built-in deployment features
- Render or Fly.io also supported
- Legacy Netlify configuration available in `netlify/` folder (not recommended due to timeout limits)