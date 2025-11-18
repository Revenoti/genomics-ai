import { createClient } from '@supabase/supabase-js';

// Check for Supabase environment variables (ensure they're non-empty strings)
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_ANON_KEY?.trim();
const hasSupabaseConfig = supabaseUrl && supabaseKey && supabaseUrl.length > 0 && supabaseKey.length > 0;

if (!hasSupabaseConfig) {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_ANON_KEY not set. RAG search will use fallback context.');
}

// Create Supabase client only if credentials are valid non-empty strings
export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

// Cache schema availability to avoid repeated network calls
let schemaAvailable: boolean | null = null;
let schemaProbePromise: Promise<boolean> | null = null;

// Boot-time schema probe - check if documents table exists
async function probeSupabaseSchema(): Promise<boolean> {
  if (!supabase) return false;
  
  try {
    const { error } = await supabase
      .from('documents')
      .select('content', { head: true, count: 'exact' })
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116' || error.code === '406' || error.message?.includes('does not exist')) {
        console.log('Supabase schema probe: documents table not found');
        return false;
      }
      console.warn('Supabase schema probe error:', error.message || error.code || JSON.stringify(error));
      return false;
    }
    
    console.log('Supabase schema probe: documents table available');
    return true;
  } catch (error: any) {
    console.error('Supabase schema probe exception:', error?.message || error);
    return false;
  }
}

// Initialize schema probe on module load
if (supabase) {
  schemaProbePromise = probeSupabaseSchema().then(available => {
    schemaAvailable = available;
    return available;
  });
}

// Fallback context when Supabase is not available
const FALLBACK_CONTEXT = [{
  content: `Functional Genomic Medicine is a revolutionary clinic specializing in precision medicine for autism spectrum disorders, PANDAS/PANS, autoimmune conditions, cognitive decline, and mental wellness. 

The clinic's flagship service is the Posey Protocol, a unique 8-step personalized genomic protocol developed by Dr. Gwendolyn Posey. It analyzes over 800 genes to identify root biological causes and create targeted interventions.

Key Services:
- ASD & PANDAS/PANS Treatment: Comprehensive genomic analysis for autism and autoimmune neuropsychiatric disorders
- Brain Optimization: Cognitive enhancement through precision medicine
- Executive Combination: Complete health assessment with genomic insights
- Mental Wellness: Integrative psychiatric care using genetic profiling
- Mighty Mind & Body: Holistic approach to mental and physical health

For scheduling consultations, visit: https://functionalgenomicmedicine.com/contact-us/`,
  metadata: { source: 'fallback' }
}];

// Function to perform RAG similarity search
export async function performRAGSearch(query: string, matchCount: number = 5) {
  // Return fallback if Supabase is not configured
  if (!supabase) {
    console.log('Using fallback RAG context (Supabase not configured)');
    return FALLBACK_CONTEXT;
  }

  // Wait for boot-time schema probe if still pending
  if (schemaProbePromise) {
    await schemaProbePromise;
    schemaProbePromise = null; // Clear after first use
  }

  // Fast-fail if schema was detected as unavailable
  if (schemaAvailable === false) {
    console.log('Using fallback RAG context (schema unavailable - cached)');
    return FALLBACK_CONTEXT;
  }

  try {
    // Try to use Supabase's documents table with text search
    const { data, error } = await supabase
      .from('documents')
      .select('content, metadata')
      .textSearch('content', query)
      .limit(matchCount);

    if (error) {
      // Handle specific PostgREST errors gracefully
      if (error.code === 'PGRST116' || error.code === '406' || error.message.includes('does not exist')) {
        console.warn('RAG search: documents table not found or schema mismatch (using fallback, caching state)');
        schemaAvailable = false; // Cache that schema is unavailable
        return FALLBACK_CONTEXT;
      }
      console.warn('RAG search error (using fallback):', error.message);
      return FALLBACK_CONTEXT;
    }

    // Schema is available
    if (schemaAvailable === null) {
      schemaAvailable = true;
      console.log('RAG search: schema available, caching state');
    }

    // Return data if available, otherwise fallback
    return (data && data.length > 0) ? data : FALLBACK_CONTEXT;
  } catch (error: any) {
    // Catch all errors including network issues, PostgREST errors, etc.
    console.error('RAG search exception (using fallback):', error?.message || error);
    return FALLBACK_CONTEXT;
  }
}
