import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qcrnyxozrxzfhqtctgrz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjcm55eG96cnh6ZmhxdGN0Z3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Mjc5OTIsImV4cCI6MjA4NjEwMzk5Mn0.hpm6J3lacymjXVQcX5S-IoEBWEwy6FbwHqkkh2duPyc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
