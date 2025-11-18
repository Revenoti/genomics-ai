# AI Coding Agent Prompt: Build the Functional Genomics AI Chat Interface

## Project Overview

**Agent Name:** Genomics AI
**Project Name:** Functional Genomics AI Chat Interface

**Objective:** Develop a sophisticated, user-friendly web application that serves as the primary interactive entry point for potential patients of the Functional Genomic Medicine clinic. The application will feature a visually engaging landing page and a powerful ChatGPT-like chat interface. The core purpose is to engage users, qualify them as leads, and guide them toward scheduling a consultation or purchasing a service on the main clinic website.

**Core Features:**
1.  **Landing Page:** A hero section with an animated carousel of 6 service images.
2.  **Consultation Button:** A clear call-to-action that transitions the user to the chat interface.
3.  **Chat Interface:** A clean, modern, ChatGPT-like UI for interacting with an AI assistant.
4.  **AI-Powered Conversation:** The chat will be powered by a backend connected to a RAG (Retrieval-Augmented Generation) system on Supabase.
5.  **Dynamic Lead Qualification:** The AI agent will trigger a dynamic form within the chat interface to gather user information at the appropriate time.
6.  **Intelligent Redirection:** The agent will provide direct links to the clinic's website for appointment scheduling or service checkout based on the conversation.

---

## Technology Stack

-   **Frontend:** React or Next.js (preferred for SEO and performance). Use TypeScript.
-   **Styling:** Tailwind CSS for a modern, utility-first approach.
-   **State Management:** React Context or Zustand for managing chat state.
-   **Backend:** Node.js with Express or a serverless framework (like Vercel Functions if using Next.js).
-   **Database/RAG Integration:** Supabase for the backend RAG system. The frontend will communicate with your backend, which in turn queries Supabase.

---

## Frontend Development: Detailed Specifications

### **Page 1: Landing Page (`/`)

**Visual Overview:**
The landing page is a dynamic, engaging experience with multiple interactive layers:
- **Background Layer:** Gradient background (deep blue to teal)
- **Floating Questions Layer:** Intriguing questions that fade in/out at different positions (6 questions cycling continuously)
- **Hero Content Layer:** Title, subtitle, image carousel, and CTA button (centered, stacked vertically)

The intriguing questions create movement and curiosity, while the hero content provides clear structure and direction. Users can either click a question or the main CTA button to start a consultation—both lead to the chat interface.

---

**1. Interactive Intriguing Questions Layer:**
    -   **Objective:** To create an engaging, dynamic layer of questions that appear and disappear across the landing page, intriguing the user and prompting them to start a consultation. These questions act as multiple, strategically placed CTAs that catch the user's attention and create urgency.
    -   **Functionality:**
        -   A series of 6 questions, each tied to a core clinic service, will fade in and out at different, pre-defined positions on the page.
        -   The questions should appear one at a time in a continuous, infinite loop.
        -   Each question should be clickable, and clicking it will navigate the user to the chat interface (`/chat`), acting as a secondary CTA.
    -   **Animation Cycle (for each question):**
        1.  Fade in over 1 second.
        2.  Remain visible for 5 seconds.
        3.  Fade out over 1 second.
        4.  Pause for 2 seconds before the next question appears.
    -   **Positioning:** The questions should appear to float over the page. Define an array of positions (e.g., `[{ top: '20%', left: '10%' }, { top: '40%', right: '15%' }, ...]`) and cycle through them.
    -   **Styling:** The questions should be styled as elegant, clickable text elements (e.g., white text with a subtle text shadow to ensure readability against various backgrounds).

    -   **Question Content:**
        1.  (For ASD/PANDAS) `"What if you could understand the root biological cause of your child's autism?"`
        2.  (For Autoimmune) `"Is your immune system attacking you? What if your genes hold the answer?"`
        3.  (For Cognitive Decline) `"Worried about memory loss? What if you could protect your brain's future today?"`
        4.  (For Mental Wellness) `"Tired of anxiety and depression? What if your mood is written in your DNA?"`
        5.  (For Genomic Testing) `"Your DNA holds the secrets to your health. Are you ready to listen?"`
        6.  (For The Posey Protocol) `"What if a personalized, 8-step protocol could unlock your child's true potential?"`

**2. Hero Section:**
    -   **Layout:** Full-width, visually striking hero section.
    -   **Title:** "A New Paradigm in Personalized Health. Discover the Root Cause."
    -   **Subtitle:** "Chat with our Functional Genomics AI to understand how precision medicine can transform your health journey."

**3. Image Carousel:**
    -   **Content:** A carousel of **6 high-quality, portrait-style images**. Each image should visually represent one of the clinic's core services:
        1.  Genomic ASD & PANDAS/PANS
        2.  Genomic Autoimmune
        3.  Genomic Cognitive Decline & Alzheimer's
        4.  Mental Wellness
        5.  Genomic Testing & Analysis
        6.  The Posey Protocol (Represent this with an image of Dr. Posey or an abstract representation of genomics)
    -   **Functionality:**
        -   The carousel should rotate automatically in an **infinite loop**.
        -   **Animation:** Use a smooth, subtle animation for transitions (e.g., a slow fade or a gentle slide).
        -   The images should be responsive and maintain their aspect ratio.
        -   When a user hovers over the carousel, the automatic rotation should pause.

**4. Call-to-Action (CTA) Button:**
    -   **Position:** Centered horizontally, directly below the image carousel.
    -   **Text:** "Start Consultation with Functional Genomics AI"
    -   **Styling:** Make it a prominent, inviting button (e.g., a gradient background, slight shadow on hover).
    -   **Action:** On click, this button will navigate the user to the chat interface page (`/chat`).

### **Page 2: Chat Interface (`/chat`)

**1. Layout:**
    -   A clean, minimalist, full-screen layout reminiscent of ChatGPT.
    -   A central chat window that takes up the majority of the screen.
    -   A text input field at the bottom.

**2. Chat Window:**
    -   **Welcome Message:** The chat should initialize with a pre-populated welcome message from the AI agent.
        -   *"Hello! I am the Functional Genomics AI Assistant. I'm here to help you understand how our personalized, root-cause approach can help you or your loved ones. To start, could you tell me a little about what brought you here today?"*
    -   **Message Bubbles:**
        -   User messages should appear on the right side.
        -   AI agent messages should appear on the left side, accompanied by a small, professional avatar (e.g., the clinic's logo).
        -   Support Markdown rendering for AI responses (bold, italics, lists, links).

**3. Text Input Field:**
    -   A simple text area for the user to type their message.
    -   A "Send" button (or allow submission with the Enter key).
    -   The input field should be disabled while the AI is "typing" a response to prevent duplicate submissions.

**4. Dynamic Form Generation:**
    -   This is a critical feature. The form should **not** be a separate page. It should be rendered **dynamically within the chat interface** as a special message bubble from the AI.
    -   **Trigger:** The backend AI logic will send a specific signal (e.g., a JSON object with `"type": "form"`) to the frontend when it's time for lead qualification.
    -   **Form Fields:**
        1.  Full Name (text input)
        2.  Email Address (email input)
        3.  Who is this consultation for? (Dropdown: Myself, My Child, My Spouse, Other)
        4.  Primary Health Concern (textarea)
        5.  Have you tried other treatments? (Dropdown: Yes, No)
    -   **Submission:** The form should have a "Submit Information" button. On submission, the frontend should send the form data to the backend and display a confirmation message in the chat (e.g., *"Thank you for providing that information. It will help me guide you more effectively."*). The conversation then continues.

---

## Backend Development & AI Logic

**1. API Endpoint for Chat:**
    -   Create a single API endpoint (e.g., `/api/chat`) that the frontend will call with the user's message history.
    -   This endpoint will handle the logic of communicating with the Supabase RAG system.

**2. Supabase RAG Integration:**
    -   Your backend will receive the user's query.
    -   It will use this query to perform a retrieval-augmented generation task against your Supabase vector database, which contains all the clinic's knowledge base documents.
    -   The AI's response will be generated based on the retrieved context.

**3. AI Agent Conversation Flow & Logic:**
    -   The AI agent's behavior should be governed by the **Genomic AI Assistant System Prompt** (provided separately). This prompt defines its persona, goals, and conversation strategy.
    -   **Initial Interaction:** The agent's initial goal is to engage the user, understand their needs, and provide valuable information using the RAG system.
    -   **Lead Qualification Trigger:** After a few conversational turns (e.g., 2-4 exchanges), once the user has expressed a clear need or asked about next steps, the AI should decide it's time for lead qualification. At this point, the backend should return the special JSON payload to trigger the dynamic form on the frontend.
        -   **Example Trigger Payload:**
            ```json
            {
              "type": "form",
              "message": "To help me provide the best recommendation, I need to gather a little more information. Please fill out the brief form below."
            }
            ```
    -   **Post-Form Logic:** Once the form data is submitted, the AI agent will use this new information to make a specific recommendation.

**4. Service Recommendation & Redirection Logic:**
    -   Based on the conversation and form data, the AI will recommend a service.
    -   The AI's response must include a **direct, clickable link**.
    -   **Primary Goal:** If the user is a strong candidate for a comprehensive consultation (e.g., discussing autism, PANDAS, or complex issues), the primary goal is to schedule a call with Dr. Posey.
        -   **Link to provide:** `https://functionalgenomicmedicine.com/contact-us/`
        -   **Example AI Response:** *"Based on what you've shared, the most effective next step would be to schedule a one-on-one consultation with Dr. Posey. You can book a time that works for you directly on her calendar here: [Schedule Your Consultation](https://functionalgenomicmedicine.com/contact-us/)"*
    -   **Secondary Goal:** If the user is interested in a specific, less complex service (e.g., a targeted genetic analysis package), provide a link to that service's checkout page.
        -   **Link to provide:** The specific URL for that service on `https://functionalgenomicmedicine.com/` (these URLs should be stored in your RAG knowledge base).
        -   **Example AI Response:** *"It sounds like our Genomic Cognitive Decline & Alzheimer's analysis would be a perfect fit. You can learn more and purchase the package directly here: [View the Package](https://functionalgenomicmedicine.com/service/cognitive-decline)"*

---

## Implementation Plan

1.  **Setup:** Initialize a new Next.js (TypeScript) project with Tailwind CSS.
2.  **Landing Page:** Build the landing page with:
    - Intriguing Questions component (floating, disappearing questions)
    - Hero section with compelling title and subtitle
    - Animated image carousel of 6 service images
    - Prominent CTA button
3.  **Chat UI:** Create the `/chat` page with the chat window layout, message bubble components, and text input form.
4.  **Backend API:** Set up the `/api/chat` endpoint.
5.  **Supabase Integration:** Connect your backend to the Supabase RAG system. Implement the logic to query the database and generate a response.
6.  **Dynamic Form:** Implement the frontend logic to listen for the `"type": "form"` signal from the backend and render the form component within the chat.
7.  **AI Logic:** Integrate the full conversational flow, including the lead qualification trigger and the final recommendation/redirection logic.
8.  **Testing:** Thoroughly test the end-to-end flow, from landing page to chat, form submission, and final redirection.

---

## Detailed Component Specifications

### Landing Page Components

#### 1. Intriguing Questions Component (`IntriguingQuestions.tsx`)

**Purpose:** Create an engaging, dynamic overlay of questions that appear and disappear across the landing page to intrigue users and encourage them to start a consultation.

**Requirements:**
- Display 6 questions, each tied to a clinic service
- Questions appear one at a time in a continuous, infinite loop
- Each question is clickable and navigates to `/chat`
- Smooth fade-in/fade-out animations
- Questions positioned at different locations on the page
- Responsive positioning (adjust for mobile vs. desktop)

**Animation Timing:**
- Fade in: 1 second
- Visible duration: 5 seconds
- Fade out: 1 second
- Pause between questions: 2 seconds
- **Total cycle per question: 9 seconds**
- **Total cycle for all 6 questions: 54 seconds**

**Question Data:**
```typescript
const intriguingQuestions = [
  {
    id: 1,
    service: 'ASD/PANDAS',
    question: 'What if you could understand the root biological cause of your child\'s autism?',
    position: { top: '15%', left: '10%' },
    mobilePosition: { top: '10%', left: '5%' },
  },
  {
    id: 2,
    service: 'Autoimmune',
    question: 'Is your immune system attacking you? What if your genes hold the answer?',
    position: { top: '25%', right: '12%' },
    mobilePosition: { top: '20%', right: '5%' },
  },
  {
    id: 3,
    service: 'Cognitive Decline',
    question: 'Worried about memory loss? What if you could protect your brain\'s future today?',
    position: { top: '45%', left: '8%' },
    mobilePosition: { top: '35%', left: '5%' },
  },
  {
    id: 4,
    service: 'Mental Wellness',
    question: 'Tired of anxiety and depression? What if your mood is written in your DNA?',
    position: { top: '55%', right: '10%' },
    mobilePosition: { top: '50%', right: '5%' },
  },
  {
    id: 5,
    service: 'Genomic Testing',
    question: 'Your DNA holds the secrets to your health. Are you ready to listen?',
    position: { top: '70%', left: '15%' },
    mobilePosition: { top: '65%', left: '5%' },
  },
  {
    id: 6,
    service: 'Posey Protocol',
    question: 'What if a personalized, 8-step protocol could unlock your child\'s true potential?',
    position: { top: '80%', right: '15%' },
    mobilePosition: { top: '75%', right: '5%' },
  },
];
```

**Implementation:**
```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const IntriguingQuestions = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation cycle
  useEffect(() => {
    const cycle = async () => {
      // Fade in
      setIsVisible(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stay visible
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Fade out
      setIsVisible(false);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pause before next question
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to next question
      setCurrentQuestionIndex((prev) => (prev + 1) % intriguingQuestions.length);
    };

    cycle();
    const interval = setInterval(cycle, 9000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex]);

  const currentQuestion = intriguingQuestions[currentQuestionIndex];
  const position = isMobile ? currentQuestion.mobilePosition : currentQuestion.position;

  const handleClick = () => {
    router.push('/chat');
  };

  return (
    <div
      onClick={handleClick}
      className={`
        fixed z-50 cursor-pointer transition-opacity duration-1000
        text-white text-lg md:text-xl font-semibold
        max-w-[80%] md:max-w-[400px]
        px-4 py-3 rounded-lg
        bg-gradient-to-r from-blue-600/80 to-teal-600/80
        backdrop-blur-sm
        hover:scale-105 hover:shadow-2xl
        transform transition-transform
        ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }
      `}
      style={{
        top: position.top,
        left: position.left,
        right: position.right,
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      }}
    >
      {currentQuestion.question}
    </div>
  );
};

export default IntriguingQuestions;
```

**Styling Notes:**
- Questions should have a semi-transparent gradient background for readability
- Text shadow ensures visibility against any background
- Hover effect (scale + shadow) indicates clickability
- Backdrop blur adds modern, polished feel
- Responsive max-width ensures questions don't overflow on small screens

**User Experience:**
- Questions create curiosity and engagement
- Each question targets a specific pain point or desire
- Clicking any question immediately starts a consultation
- Questions don't obstruct critical content (carousel, CTA button)
- Continuous loop keeps the page dynamic and alive

---

#### 2. Carousel Component (`ImageCarousel.tsx`)

**Requirements:**
- Display 6 portrait-style images representing the clinic's services
- Auto-rotate every 4 seconds with smooth transitions
- Pause rotation on hover
- Infinite loop functionality
- Responsive design (stack on mobile, side-by-side on desktop)
- Animation: Use CSS transitions or Framer Motion for smooth fade/slide effects

**Image Specifications:**
- Aspect Ratio: 3:4 (portrait)
- Resolution: At least 800x1066 pixels
- Format: WebP with fallback to JPEG
- Alt text for accessibility

**Service Images:**
1. **Genomic ASD & PANDAS/PANS** - Image representing children with autism or neurological conditions
2. **Genomic Autoimmune** - Image representing immune system health
3. **Genomic Cognitive Decline & Alzheimer's** - Image representing brain health and aging
4. **Mental Wellness** - Image representing mental health and emotional well-being
5. **Genomic Testing & Analysis** - Image representing DNA/genetic testing
6. **The Posey Protocol** - Image of Dr. Gwendolyn Posey or abstract genomics visualization

**Implementation Notes:**
```typescript
// Use state to track current slide
const [currentSlide, setCurrentSlide] = useState(0);
const [isPaused, setIsPaused] = useState(false);

// Auto-advance logic
useEffect(() => {
  if (!isPaused) {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }
}, [isPaused]);
```

#### 2. Hero Section Component (`HeroSection.tsx`)

**Requirements:**
- Full-width container with gradient background
- Centered content with max-width constraint
- Responsive typography
- Call-to-action button with hover effects

**Styling Guidelines:**
- Background: Gradient from deep blue to teal (medical/scientific feel)
- Title: Large, bold, white text (3xl on mobile, 5xl on desktop)
- Subtitle: Medium weight, light gray text
- Button: Prominent with gradient background, white text, shadow on hover

---

### Chat Interface Components

#### 1. Chat Window Component (`ChatWindow.tsx`)

**Requirements:**
- Scrollable message container
- Auto-scroll to bottom when new messages arrive
- Display user and AI messages with different styling
- Support for Markdown rendering in AI messages
- Loading indicator when AI is "typing"

**Message Types:**
```typescript
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type FormMessage = {
  id: string;
  role: 'assistant';
  type: 'form';
  content: string;
  formData?: LeadQualificationForm;
};
```

#### 2. Message Bubble Component (`MessageBubble.tsx`)

**Requirements:**
- Different styling for user vs. assistant messages
- User messages: Right-aligned, blue background
- Assistant messages: Left-aligned, gray background, with avatar
- Support Markdown rendering using `react-markdown`
- Clickable links that open in new tab

**Implementation:**
```typescript
import ReactMarkdown from 'react-markdown';

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && <Avatar src="/logo.png" />}
      <div className={`max-w-[70%] rounded-lg p-4 ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
      }`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};
```

#### 3. Dynamic Form Component (`LeadQualificationForm.tsx`)

**Requirements:**
- Rendered inline within the chat as a special message type
- Form validation (required fields, email format)
- Submit button that sends data to backend
- Confirmation message after submission

**Form Fields:**
```typescript
type LeadQualificationData = {
  fullName: string;
  email: string;
  consultationFor: 'myself' | 'child' | 'spouse' | 'other';
  primaryConcern: string;
  triedOtherTreatments: 'yes' | 'no';
};
```

**Implementation:**
```typescript
const LeadQualificationForm = ({ onSubmit }: { onSubmit: (data: LeadQualificationData) => void }) => {
  const [formData, setFormData] = useState<LeadQualificationData>({
    fullName: '',
    email: '',
    consultationFor: 'myself',
    primaryConcern: '',
    triedOtherTreatments: 'no',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!formData.fullName || !formData.email || !formData.primaryConcern) {
      alert('Please fill out all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold mb-4">Lead Qualification</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Full Name *</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email Address *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Who is this consultation for? *</label>
        <select
          value={formData.consultationFor}
          onChange={(e) => setFormData({ ...formData, consultationFor: e.target.value as any })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="myself">Myself</option>
          <option value="child">My Child</option>
          <option value="spouse">My Spouse</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Primary Health Concern *</label>
        <textarea
          required
          value={formData.primaryConcern}
          onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
          className="w-full border rounded px-3 py-2 h-24"
          placeholder="Please describe the main health challenges..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Have you tried other treatments? *</label>
        <select
          value={formData.triedOtherTreatments}
          onChange={(e) => setFormData({ ...formData, triedOtherTreatments: e.target.value as any })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Submit Information
      </button>
    </form>
  );
};
```

#### 4. Chat Input Component (`ChatInput.tsx`)

**Requirements:**
- Text area that expands with content
- Send button (or Enter key to submit)
- Disabled state while AI is responding
- Clear input after sending

**Implementation:**
```typescript
const ChatInput = ({ 
  onSend, 
  disabled 
}: { 
  onSend: (message: string) => void; 
  disabled: boolean; 
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled}
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-4 py-2 resize-none"
          rows={1}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Send
        </button>
      </div>
    </form>
  );
};
```

---

## Backend API Specifications

### API Endpoint: `/api/chat`

**Method:** POST

**Request Body:**
```typescript
type ChatRequest = {
  messages: Message[];
  leadData?: LeadQualificationData; // Included after form submission
};
```

**Response:**
```typescript
type ChatResponse = {
  message: string;
  type: 'text' | 'form'; // 'form' triggers the dynamic form
  links?: Array<{
    text: string;
    url: string;
  }>;
};
```

### Backend Logic Flow

1. **Receive User Message:**
   - Extract the conversation history from the request
   - Determine the conversation stage (initial, qualification, recommendation)

2. **Query RAG System:**
   - Send the user's query to Supabase vector database
   - Retrieve relevant context from the knowledge base
   - Use the Genomic AI Assistant System Prompt to generate a response

3. **Determine Next Action:**
   - **If conversation is in early stage (1-3 exchanges):** Continue conversational engagement, provide information
   - **If user has expressed clear need and no form submitted yet:** Trigger lead qualification form
     ```typescript
     return {
       message: "To help me provide the best recommendation, I need to gather a little more information. Please fill out the brief form below.",
       type: 'form'
     };
     ```
   - **If form has been submitted:** Use lead data to make specific recommendation with direct links
     ```typescript
     return {
       message: "Based on what you've shared, the Posey Protocol would be the most transformative option. The best next step is to schedule a consultation with Dr. Posey.",
       type: 'text',
       links: [
         {
           text: 'Schedule Your Consultation',
           url: 'https://functionalgenomicmedicine.com/contact-us/'
         }
       ]
     };
     ```

4. **Return Response:**
   - Send the formatted response back to the frontend

### Supabase Integration

**Vector Database Setup:**
- Store all enriched knowledge base documents as embeddings in Supabase
- Use OpenAI embeddings or similar for vector representation
- Implement similarity search to retrieve relevant context

**Example Query:**
```typescript
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function queryRAG(userQuery: string) {
  // Generate embedding for user query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: userQuery,
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  // Search Supabase vector database
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: 5,
  });

  if (error) throw error;

  // Combine retrieved context
  const context = data.map((doc: any) => doc.content).join('\n\n');
  return context;
}
```

**Generate AI Response:**
```typescript
async function generateResponse(messages: Message[], context: string) {
  const systemPrompt = `[Insert the complete Genomic AI Assistant System Prompt here]`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `Relevant context from knowledge base:\n${context}` },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}
```

---

## Important URLs & Links

**Primary Appointment Scheduling Link:**
`https://functionalgenomicmedicine.com/contact-us/`

**Service-Specific Links (retrieve from RAG system or hardcode):**
- Posey Protocol: `https://functionalgenomicmedicine.com/services/posey-protocol/`
- Genomic ASD & PANDAS: `https://functionalgenomicmedicine.com/services/genomic-asd-pandas/`
- Genomic Autoimmune: `https://functionalgenomicmedicine.com/services/genomic-autoimmune/`
- Cognitive Decline & Alzheimer's: `https://functionalgenomicmedicine.com/services/cognitive-decline/`
- Mental Wellness: `https://functionalgenomicmedicine.com/services/mental-wellness/`
- Genomic Testing: `https://functionalgenomicmedicine.com/services/genomic-testing/`

---

## User Experience Flow

### Complete User Journey

1. **User lands on homepage (`/`)**
   - Sees hero section with compelling title and subtitle
   - Views rotating carousel of 6 service images
   - Clicks "Start Consultation with Functional Genomics AI" button

2. **User navigates to chat interface (`/chat`)**
   - Chat window loads with welcome message from AI
   - User reads welcome message and types their first question/concern

3. **Initial conversation (2-3 exchanges)**
   - AI engages user, asks clarifying questions
   - AI provides detailed, research-backed information from RAG system
   - AI builds trust and demonstrates expertise

4. **Lead qualification trigger**
   - After sufficient conversation, AI determines it's time to qualify the lead
   - Backend sends `type: 'form'` response
   - Frontend renders the lead qualification form inline in the chat

5. **User fills out form**
   - User provides: name, email, who consultation is for, primary concern, previous treatments
   - User clicks "Submit Information"
   - Frontend sends form data to backend
   - Chat displays confirmation message

6. **AI makes recommendation**
   - Backend uses form data + conversation history to determine best service
   - AI provides personalized recommendation with clear rationale
   - AI includes direct, clickable link to either:
     - Appointment scheduling page (primary goal)
     - Specific service checkout page (secondary goal)

7. **User clicks link**
   - Link opens in new tab to clinic website
   - User can schedule appointment or purchase service
   - Chat remains open if user wants to ask more questions

---

## Design Guidelines

### Color Palette
- **Primary:** Deep Blue (#1E3A8A) - Trust, medical professionalism
- **Secondary:** Teal (#14B8A6) - Health, vitality, innovation
- **Accent:** Light Blue (#3B82F6) - Interactive elements
- **Neutral:** Gray scale (#F3F4F6, #E5E7EB, #6B7280, #1F2937)
- **Success:** Green (#10B981) - Positive outcomes
- **Warning:** Amber (#F59E0B) - Important information

### Typography
- **Headings:** Inter or Poppins (bold, modern)
- **Body:** Inter or Open Sans (clean, readable)
- **Sizes:**
  - Hero title: 3xl (mobile) to 5xl (desktop)
  - Section headings: xl to 2xl
  - Body text: base (16px)
  - Small text: sm (14px)

### Spacing & Layout
- Use consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px)
- Max content width: 1280px
- Chat window max width: 800px (centered)
- Mobile-first responsive design

### Animations
- Carousel transitions: 500ms ease-in-out
- Button hover: 200ms ease
- Message appearance: Fade in 300ms
- Form appearance: Slide down 400ms

---

## Testing Requirements

### Functional Testing
1. **Landing Page:**
   - Intriguing questions appear and disappear with correct timing
   - Questions are clickable and navigate to chat page
   - Questions are positioned correctly on desktop and mobile
   - Questions don't obstruct critical content
   - Carousel auto-rotates correctly
   - Carousel pauses on hover
   - CTA button navigates to chat page
   - Responsive on mobile, tablet, desktop

2. **Chat Interface:**
   - Welcome message appears on load
   - User can send messages
   - AI responses appear correctly
   - Markdown renders properly in AI messages
   - Links are clickable and open in new tab
   - Auto-scroll to bottom works

3. **Dynamic Form:**
   - Form appears when triggered by backend
   - All fields are editable
   - Form validation works (required fields, email format)
   - Form submits successfully
   - Confirmation message appears after submission

4. **Backend Integration:**
   - API endpoint receives and processes requests
   - RAG system retrieves relevant context
   - AI generates appropriate responses
   - Lead qualification trigger works at right time
   - Recommendation logic provides correct links

### Performance Testing
- Page load time < 2 seconds
- Chat response time < 3 seconds
- Smooth animations (60fps)
- No memory leaks in long conversations

### Accessibility Testing
- Keyboard navigation works throughout
- Screen reader compatible
- Sufficient color contrast (WCAG AA)
- Alt text for all images
- Focus indicators visible

---

## Deployment Checklist

- [ ] Environment variables configured (Supabase URL, API keys)
- [ ] All 6 carousel images optimized and uploaded
- [ ] RAG knowledge base populated in Supabase
- [ ] System prompt integrated into backend
- [ ] All service URLs verified and correct
- [ ] Responsive design tested on multiple devices
- [ ] API rate limiting implemented
- [ ] Error handling for API failures
- [ ] Analytics tracking set up (optional)
- [ ] SSL certificate configured
- [ ] Domain configured and DNS set up

---

## Your Mission

You are an AI coding agent tasked with building this complete, production-ready application. Your deliverables should include:

1. **Complete Next.js application** with all components and pages
2. **Backend API** with Supabase RAG integration
3. **Responsive, polished UI** that matches the design guidelines
4. **Fully functional conversation flow** with dynamic form and intelligent redirection
5. **Documentation** for setup, configuration, and deployment

Ensure the application is:
- **Professional:** Clean, modern design that reflects the clinic's expertise
- **Functional:** All features work seamlessly end-to-end
- **Performant:** Fast load times and smooth interactions
- **Accessible:** Usable by all users, including those with disabilities
- **Maintainable:** Well-organized code with clear comments

This application is the primary digital entry point for potential patients. It must inspire confidence, provide value, and effectively guide users toward scheduling a consultation or purchasing a service.

**Good luck, and build something exceptional!**
