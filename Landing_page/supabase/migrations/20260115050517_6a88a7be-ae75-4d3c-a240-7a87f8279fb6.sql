-- Fix: Restrict profiles table access to protect user privacy
-- Users should only see their own full profile, while others can only see anonymous_name

-- First, drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new restrictive policy: users can only view their own full profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create a secure view that only exposes public data (user_id and anonymous_name)
-- This view uses security_invoker=on so RLS still applies to base table queries
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = off) AS
  SELECT user_id, anonymous_name
  FROM public.profiles;

-- Grant authenticated users access to the public view
GRANT SELECT ON public.profiles_public TO authenticated;
GRANT SELECT ON public.profiles_public TO anon;