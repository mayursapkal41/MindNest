-- Add content length constraints to prevent resource exhaustion
-- Using validation triggers instead of CHECK constraints for flexibility

-- Create validation function for community_messages
CREATE OR REPLACE FUNCTION public.validate_message_content()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.content) > 2000 THEN
    RAISE EXCEPTION 'Message content too long (max 2000 characters)';
  END IF;
  IF length(NEW.content) < 1 THEN
    RAISE EXCEPTION 'Message content cannot be empty';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create validation function for message_replies
CREATE OR REPLACE FUNCTION public.validate_reply_content()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.content) > 1000 THEN
    RAISE EXCEPTION 'Reply content too long (max 1000 characters)';
  END IF;
  IF length(NEW.content) < 1 THEN
    RAISE EXCEPTION 'Reply content cannot be empty';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create validation function for profiles
CREATE OR REPLACE FUNCTION public.validate_profile_content()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.full_name) > 100 THEN
    RAISE EXCEPTION 'Full name too long (max 100 characters)';
  END IF;
  IF length(NEW.anonymous_name) > 50 THEN
    RAISE EXCEPTION 'Anonymous name too long (max 50 characters)';
  END IF;
  IF length(NEW.full_name) < 2 THEN
    RAISE EXCEPTION 'Full name must be at least 2 characters';
  END IF;
  IF length(NEW.anonymous_name) < 2 THEN
    RAISE EXCEPTION 'Anonymous name must be at least 2 characters';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for validation
CREATE TRIGGER validate_message_content_trigger
  BEFORE INSERT OR UPDATE ON public.community_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_message_content();

CREATE TRIGGER validate_reply_content_trigger
  BEFORE INSERT OR UPDATE ON public.message_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_reply_content();

CREATE TRIGGER validate_profile_content_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_content();