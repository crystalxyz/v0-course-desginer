-- Create table for early access signups
CREATE TABLE IF NOT EXISTS public.early_access_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  learning_for TEXT,
  would_use_again BOOLEAN DEFAULT true,
  willing_to_pay TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Allow anonymous inserts (since this is a public signup form)
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert (for public signup form)
CREATE POLICY "Allow anonymous inserts" ON public.early_access_signups
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow service role to read all
CREATE POLICY "Allow service role to read all" ON public.early_access_signups
  FOR SELECT
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS early_access_signups_email_idx ON public.early_access_signups(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS early_access_signups_created_at_idx ON public.early_access_signups(created_at DESC);
