-- Add community_id column to message_likes and message_replies for proper realtime filtering
ALTER TABLE message_likes ADD COLUMN community_id TEXT;
ALTER TABLE message_replies ADD COLUMN community_id TEXT;

-- Create a function to automatically sync community_id on insert
CREATE OR REPLACE FUNCTION public.sync_community_id_on_like()
RETURNS TRIGGER AS $$
BEGIN
  NEW.community_id := (SELECT community_id FROM community_messages WHERE id = NEW.message_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.sync_community_id_on_reply()
RETURNS TRIGGER AS $$
BEGIN
  NEW.community_id := (SELECT community_id FROM community_messages WHERE id = NEW.message_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers to automatically populate community_id
CREATE TRIGGER sync_like_community_id
  BEFORE INSERT ON public.message_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_community_id_on_like();

CREATE TRIGGER sync_reply_community_id
  BEFORE INSERT ON public.message_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_community_id_on_reply();

-- Backfill existing data
UPDATE message_likes SET community_id = (
  SELECT community_id FROM community_messages WHERE id = message_likes.message_id
) WHERE community_id IS NULL;

UPDATE message_replies SET community_id = (
  SELECT community_id FROM community_messages WHERE id = message_replies.message_id
) WHERE community_id IS NULL;