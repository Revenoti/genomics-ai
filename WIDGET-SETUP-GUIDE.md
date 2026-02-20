# Functional Genomics AI Chat Widget - Setup Guide

## What This Widget Does

The Functional Genomics AI Chat Widget adds a floating chat bubble to your website. When a visitor clicks the bubble, a chat window opens where they can:

- Ask questions about functional genomic medicine and your services
- Learn about the Posey Protocol and treatment options
- Get personalized information from the AI assistant
- Fill out a lead qualification form (appears automatically during conversation)

The widget works on any website, including Go High Level (GHL) sites and funnels.

---

## What You'll Need

1. Your deployed app URL (e.g., `https://genomic-ai.io`)
2. Access to your Go High Level dashboard
3. About 2 minutes

---

## Step-by-Step Instructions

### Step 1: Get Your Embed Code

Copy this single line of code. Replace `YOUR-APP-URL` with your actual deployed app address:

```html
<script src="https://YOUR-APP-URL/widget-embed.js"></script>
```

**Example with a real URL:**
```html
<script src="https://genomic-ai.io/widget-embed.js"></script>
```

---

### Step 2: Add the Widget to Your Go High Level Website

There are two ways to add the widget, depending on whether you want it on every page or just specific pages.

#### Option A: Add to ALL Pages (Recommended)

This puts the chat bubble on every page of your website.

1. Log in to your **Go High Level** dashboard
2. Click **Sites** in the left sidebar
3. Find your website and click the **three dots menu** (...)
4. Click **Settings**
5. Scroll down to find **Body Tracking Code**
6. Paste your embed code into the **Body Tracking Code** field
7. Click **Save**

That's it! The chat bubble will now appear on every page of your site.

#### Option B: Add to a Specific Page Only

If you only want the chat bubble on certain pages (like your homepage or a landing page):

1. Log in to your **Go High Level** dashboard
2. Click **Sites** in the left sidebar
3. Open your website or funnel
4. Click **Edit Page** on the page where you want the widget
5. Click **Settings** at the top of the page builder
6. Scroll down to the **Body Code** section
7. Paste your embed code
8. Click **Save**

---

### Step 3: Add to a Funnel Page

If you're using a GHL funnel instead of a website:

1. Go to **Sites** > **Funnels**
2. Select your funnel
3. Click on the specific funnel step/page
4. Click **Settings** at the top
5. Find the **Body Code** section
6. Paste your embed code
7. Click **Save**

---

### Step 4: Configure Allowed Origins (Important for Security)

To ensure only your website can use the chat widget, you need to set an environment variable on your deployed app.

Set the `WIDGET_ALLOWED_ORIGINS` environment variable to your Go High Level website's domain:

```
WIDGET_ALLOWED_ORIGINS=https://yoursite.com
```

If you have multiple domains or subdomains, separate them with commas:

```
WIDGET_ALLOWED_ORIGINS=https://yoursite.com,https://www.yoursite.com,https://landing.yoursite.com
```

**Where to set this:**
- **Railway**: Go to your project > Variables > Add the variable
- **Replit**: Go to Secrets tab > Add the variable
- **Other hosts**: Check your hosting platform's environment variable settings

---

## Verify It's Working

1. Open your Go High Level website in a new browser tab
2. Look for a **teal/green chat bubble** in the bottom-right corner
3. Click the bubble to open the chat window
4. Try sending a message to confirm the AI responds
5. Click the X button or the bubble again to close the chat

---

## How the Widget Looks

- **Closed**: A small round chat bubble icon in the bottom-right corner
- **Open**: A 400x600px chat window that slides up from the bubble
- **Mobile**: On small screens, the chat window expands to fill the entire screen for easy typing

---

## Customization Options

### Override the App URL

If you're hosting the embed script separately from your app, you can specify where the app lives using a `data-origin` attribute:

```html
<script src="/path/to/widget-embed.js" data-origin="https://genomic-ai.io"></script>
```

---

## Troubleshooting

### The chat bubble doesn't appear

- **Check the URL**: Make sure the URL in your embed code is correct and your app is running
- **Check the code placement**: The script should be in the **Body** code section, not the Header
- **Check browser console**: Right-click on your page > Inspect > Console tab. Look for any red error messages
- **Script tags in divs**: In GHL, make sure the `<script>` tag is NOT inside a `<div>` tag. GHL requires script tags to be standalone

### The chat opens but shows an error

- **Check CORS**: Make sure your `WIDGET_ALLOWED_ORIGINS` environment variable includes your website's exact domain (including `https://`)
- **Check the app**: Visit your app URL directly (e.g., `https://genomic-ai.io/widget`) to make sure it loads

### The chat works but responses are slow

- This is normal for the first message as the AI needs to initialize
- Subsequent messages should be faster
- If consistently slow, check your OpenAI API key and usage limits

### The widget doesn't appear on mobile

- The widget is mobile-responsive and should work on all devices
- Make sure you're not using any CSS on your GHL page that might hide fixed-position elements

---

## Removing the Widget

To remove the chat widget from your site:

1. Go back to where you added the embed code (site settings or page settings)
2. Delete the `<script>` line you pasted
3. Click **Save**

The chat bubble will immediately stop appearing on your site.

---

## Support

If you run into issues that aren't covered above, check:

- That your app is deployed and accessible at the URL in your embed code
- That the `/widget` page loads when you visit it directly in your browser
- The browser console (right-click > Inspect > Console) for any error messages
