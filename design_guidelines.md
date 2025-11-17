# Design Guidelines: Functional Genomics AI Chat Interface

## Design Approach

**Reference-Based Approach**: Drawing inspiration from healthcare technology leaders (Modern Health, Headway, One Medical) combined with conversational AI interfaces (ChatGPT, Claude). The design balances medical credibility with approachable, modern technology aesthetics.

**Core Principles**:
- **Trust Through Design**: Professional, clean layouts that convey medical expertise and credibility
- **Conversational Clarity**: Chat interface prioritizes readability and natural conversation flow
- **Progressive Disclosure**: Landing page engages, chat interface deepens relationship, dynamic forms appear contextually
- **Human-Centered**: Warm, empathetic design acknowledging users' emotional health journeys

---

## Typography System

**Font Stack**:
- **Primary**: Inter (body text, UI elements, chat messages) - clean, highly readable at all sizes
- **Display**: Sora (headings, hero titles) - modern, authoritative, scientific feel

**Type Scale**:
- Hero Title: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headings: text-3xl md:text-4xl, font-semibold
- Subheadings: text-xl md:text-2xl, font-medium
- Body/Chat: text-base md:text-lg, font-normal
- Small/Meta: text-sm, font-normal

**Line Heights**: Leading-relaxed (1.625) for body text to enhance readability of medical information

---

## Layout & Spacing System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Tight spacing: p-4, gap-4 (form fields, card internals)
- Standard spacing: p-8, gap-8 (section padding, component separation)
- Generous spacing: py-16 md:py-24 (major section divisions)

**Container Strategy**:
- Landing page: max-w-7xl mx-auto (1280px max)
- Chat interface: max-w-4xl mx-auto for conversation (optimal reading width)
- Forms: max-w-2xl (comfortable form completion)

**Grid Systems**:
- Landing carousel: Single column mobile, responsive sizing on desktop
- Service images: Portrait orientation (3:4 aspect ratio), responsive scaling

---

## Landing Page Layout

### Hero Section
- Full viewport height (min-h-screen) with centered content
- Vertical layout: Title → Subtitle → Carousel → CTA Button
- Maximum content width: max-w-5xl mx-auto
- Padding: px-6 py-12 md:px-12 md:py-20

### Image Carousel
**Layout**:
- Container: max-w-3xl mx-auto
- Image dimensions: Portrait (3:4 ratio), height capped at 60vh on desktop
- Positioning: Centered horizontally with mx-auto
- Spacing: mt-12 mb-8 from surrounding elements

**Carousel Mechanics**:
- Display one image at a time, centered
- Smooth fade transitions (duration-700 ease-in-out)
- Auto-advance every 4 seconds
- Pause on hover with visual feedback (slight scale transformation)
- Navigation dots centered below images (gap-2)

**Service Images Required**:
1. **Genomic ASD & PANDAS/PANS**: Warm image of parent and child, neurodevelopmental focus
2. **Genomic Autoimmune**: Abstract visualization of immune system, cellular imagery
3. **Genomic Cognitive Decline & Alzheimer's**: Elderly person engaged in cognitive activity, brain health
4. **Mental Wellness**: Person in peaceful, meditative state, emotional wellbeing
5. **Genomic Testing & Analysis**: High-tech DNA helix visualization, laboratory setting
6. **The Posey Protocol**: Professional portrait of Dr. Gwendolyn Posey or genomic data visualization

### CTA Button
- Size: px-8 py-4 text-lg md:px-12 md:py-5 md:text-xl
- Positioned: mt-12 below carousel, centered (mx-auto)
- Backdrop blur effect (backdrop-blur-sm) if overlaying gradient
- Shadow: shadow-lg with hover:shadow-xl transition

---

## Chat Interface Layout

### Overall Structure
- Full height viewport (h-screen) with fixed positioning
- Three-section layout: Header (fixed) → Messages (scrollable flex-1) → Input (fixed)
- Messages container: px-4 md:px-6, py-6, max-w-4xl mx-auto

### Message Bubbles
**User Messages** (right-aligned):
- Layout: ml-auto max-w-[80%] md:max-w-[70%]
- Padding: px-4 py-3
- Border radius: rounded-2xl rounded-tr-sm (chat bubble tail effect)
- Typography: text-base leading-relaxed

**AI Messages** (left-aligned):
- Layout: mr-auto max-w-[80%] md:max-w-[70%]
- Avatar: 40x40 circle, positioned to left with mr-3
- Content wrapper: flex gap-3
- Padding: px-4 py-3
- Border radius: rounded-2xl rounded-tl-sm
- Markdown support: Bold, italics, lists, inline code, links with underline on hover

**Spacing Between Messages**: space-y-4 (16px vertical gap)

### Input Area
- Fixed bottom positioning with border-top
- Container: max-w-4xl mx-auto px-4 py-4
- Textarea: w-full px-4 py-3, rounded-xl, resize-none
- Send button: Positioned absolute right-2 bottom-2 within textarea container
- Icon-only send button: p-2 rounded-lg (paper airplane icon)

### Loading State
- Three animated dots (scale pulse animation)
- Positioned in AI message bubble
- Animation: animate-pulse with staggered delays

---

## Dynamic Form Component

**Rendering**: Appears as special AI message bubble with form embedded
**Layout**: Full width of message area (max-w-[95%])
**Structure**:
- Introduction text from AI (mb-6)
- Form fields in vertical stack (space-y-5)
- Submit button at bottom (w-full md:w-auto md:ml-auto)

**Form Fields**:
- Label typography: text-sm font-medium mb-2
- Input fields: px-4 py-3 rounded-lg border
- Dropdowns: Custom styled select with chevron icon
- Textarea: min-h-[120px] with resize-vertical
- Focus states: Visible border change, subtle shadow

**Field Layout**:
1. Full Name: Single column, text input
2. Email: Single column, email input with validation
3. Who is this for: Dropdown (Myself, My Child, My Spouse, Other)
4. Primary Health Concern: Textarea, 3-4 rows
5. Previous Treatments: Dropdown (Yes, No)

**Submit Button**: 
- Size: px-6 py-3 text-base font-medium
- Position: mt-6, right-aligned on desktop, full-width on mobile

---

## Component Specifications

### Navigation (Chat Page)
- Minimal header: Clinic logo (left) + "Genomics AI Assistant" title (center)
- Height: h-16, border-bottom
- Sticky positioning: sticky top-0

### Links in AI Responses
- Underlined by default
- Font weight: font-semibold
- Hover: Subtle scale (scale-105) and enhanced underline
- External link icon appended for clinic website links

### Scroll Behavior
- Chat messages: Auto-scroll to bottom on new message
- Smooth scroll: scroll-smooth class on container
- Scroll indicator: Subtle shadow at top when scrolled

### Responsive Breakpoints
- Mobile: Base styles (< 768px)
- Tablet: md: (768px+)
- Desktop: lg: (1024px+)
- Wide: xl: (1280px+)

---

## Animation & Transitions

**Carousel**:
- Transition: transition-opacity duration-700 ease-in-out
- Image change: Cross-fade effect
- Hover pause: Subtle transform scale-[1.02]

**Chat Messages**:
- Entry animation: Fade in from bottom (opacity + translateY)
- Duration: 300ms with ease-out
- No animation on scroll (performance)

**Buttons**:
- Hover: transform scale-105, shadow enhancement
- Active: scale-95
- Duration: 150ms ease-in-out

**Form Submission**:
- Disabled state during submission
- Loading spinner replaces button text
- Success: Smooth transition back to chat

---

## Accessibility Requirements

- All interactive elements: min-height 44px (touch target)
- Form labels: Properly associated with inputs (htmlFor/id)
- ARIA labels: Chat messages role="log", form role="form"
- Keyboard navigation: Full tab order, Enter to send message
- Focus indicators: Visible 2px outline on all focusable elements
- Alt text: Descriptive text for all carousel images and avatar

---

## Images Summary

**Hero Section**: No background hero image - instead features prominent image carousel as the visual centerpiece

**Image Carousel**: 6 portrait-style professional medical/healthcare images representing each service (specifications detailed above)

**Chat Interface**: Clinic logo/avatar (circular, 40x40px) for AI messages

**Overall Image Strategy**: Medical photography should feel authentic, diverse, warm, and hopeful - avoiding stock photo clichés while maintaining professional credibility