import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://boscpbdfstgbeyzstrmk.supabase.co ';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc2NwYmRmc3RnYmV5enN0cm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTk2NTMsImV4cCI6MjA5Nzg5NTY1M30.G2HjiSWHSYzRyoOY6eLPLz_8PEP-tc0zZZuifhFR0Yw';

export const supabase = createClient(supabaseUrl, supabaseKey);
