-- Fix: Eliminate SECURITY DEFINER view by storing anonymous_name directly in message tables
-- This removes the need for cross-user profile lookups

-- Step 1: Add anonymous_name column to community_messages
ALTER TABLE public.community_messages ADD COLUMN IF NOT EXISTS anonymous_name TEXT;

-- Step 2: Add anonymous_name column to message_replies  
ALTER TABLE public.message_replies ADD COLUMN IF NOT EXISTS anonymous_name TEXT;

-- Step 3: Create trigger to auto-populate anonymous_name on message insert
CREATE OR REPLACE FUNCTION public.populate_message_anonymous_name()
RETURNS TRIGGER AS $$
BEGIN
  SELECT anonymous_name INTO NEW.anonymous_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  -- Fallback if profile not found
  IF NEW.anonymous_name IS NULL THEN
    NEW.anonymous_name := 'Anonymous';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 4: Create trigger to auto-populate anonymous_name on reply insert
CREATE OR REPLACE FUNCTION public.populate_reply_anonymous_name()
RETURNS TRIGGER AS $$
BEGIN
  SELECT anonymous_name INTO NEW.anonymous_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  -- Fallback if profile not found
  IF NEW.anonymous_name IS NULL THEN
    NEW.anonymous_name := 'Anonymous';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 5: Create triggers
CREATE TRIGGER populate_message_anonymous_name_trigger
  BEFORE INSERT ON public.community_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_message_anonymous_name();

CREATE TRIGGER populate_reply_anonymous_name_trigger
  BEFORE INSERT ON public.message_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_reply_anonymous_name();

-- Step 6: Backfill existing messages with anonymous_name
UPDATE public.community_messages 
SET anonymous_name = (
  SELECT anonymous_name FROM public.profiles WHERE user_id = community_messages.user_id
)
WHERE anonymous_name IS NULL;

UPDATE public.message_replies 
SET anonymous_name = (
  SELECT anonymous_name FROM public.profiles WHERE user_id = message_replies.user_id
)
WHERE anonymous_name IS NULL;

-- Step 7: Set fallback for any messages without profiles
UPDATE public.community_messages SET anonymous_name = 'Anonymous' WHERE anonymous_name IS NULL;
UPDATE public.message_replies SET anonymous_name = 'Anonymous' WHERE anonymous_name IS NULL;

-- Step 8: Drop the SECURITY DEFINER view that was causing the issue
DROP VIEW IF EXISTS public.profiles_public;

-- Step 9: Revoke any grants that were given to the view
-- (These are no longer needed);