import { useState, useEffect } from 'react';
import { Users, Send, Shield, Heart, Sparkles, Moon, Zap, ThumbsUp, MessageCircle, ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { containsBadWord } from '@/utils/badWordsFilter';

// Constants for validation
const MAX_MESSAGE_LENGTH = 2000;
const MAX_REPLY_LENGTH = 1000;
interface Community {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  members: number;
  gradient: string;
}
interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  community_id: string;
  anonymous_name: string;
  likes_count: number;
  user_liked: boolean;
  replies: Reply[];
}
interface Reply {
  id: string;
  content: string;
  created_at: string;
  anonymous_name: string;
}
const communities: Community[] = [{
  id: 'anxiety',
  name: 'Anxiety Support',
  description: 'A gentle space to share and understand anxiety together',
  icon: <Shield className="w-6 h-6" />,
  members: 2341,
  gradient: 'bg-lavender-light'
}, {
  id: 'motivation',
  name: 'Motivation Circle',
  description: 'Uplift each other with encouragement and support',
  icon: <Zap className="w-6 h-6" />,
  members: 1876,
  gradient: 'bg-peach-light'
}, {
  id: 'healing',
  name: 'Healing & Hope',
  description: 'Journey through recovery with compassionate souls',
  icon: <Heart className="w-6 h-6" />,
  members: 3102,
  gradient: 'bg-sage-light'
}, {
  id: 'growth',
  name: 'Self-Growth',
  description: 'Discover your potential in a nurturing environment',
  icon: <Sparkles className="w-6 h-6" />,
  members: 2567,
  gradient: 'bg-sky-light'
}, {
  id: 'night',
  name: 'Late-Night Talks',
  description: 'For those quiet hours when you need connection',
  icon: <Moon className="w-6 h-6" />,
  members: 1543,
  gradient: 'bg-lavender-light'
}];

// Bad words filter is now imported from utils/badWordsFilter

const Communities = () => {
  const {
    user,
    profile,
    signOut,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [lastReplyTime, setLastReplyTime] = useState(0);

  // Fetch messages when community is selected
  useEffect(() => {
    if (selectedCommunity && user) {
      fetchMessages(selectedCommunity.id);

      // Subscribe to realtime updates
      const channel = supabase.channel(`community-${selectedCommunity.id}`).on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'community_messages',
        filter: `community_id=eq.${selectedCommunity.id}`
      }, () => {
        fetchMessages(selectedCommunity.id);
      }).on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'message_likes',
        filter: `community_id=eq.${selectedCommunity.id}`
      }, () => {
        fetchMessages(selectedCommunity.id);
      }).on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'message_replies',
        filter: `community_id=eq.${selectedCommunity.id}`
      }, () => {
        fetchMessages(selectedCommunity.id);
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedCommunity, user]);
  const fetchMessages = async (communityId: string) => {
    if (!user) return;
    setLoadingMessages(true);
    try {
      // Fetch messages
      const {
        data: messagesData,
        error: messagesError
      } = await supabase.from('community_messages').select('*').eq('community_id', communityId).order('created_at', {
        ascending: true
      });
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }
      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        setLoadingMessages(false);
        return;
      }

      // Messages now include anonymous_name directly (auto-populated by trigger)
      // No need to look up profiles separately

      // Fetch likes count and user's likes
      const messageIds = messagesData.map(m => m.id);
      const {
        data: likesData
      } = await supabase.from('message_likes').select('message_id, user_id').in('message_id', messageIds);
      const likesCountMap = new Map<string, number>();
      const userLikesSet = new Set<string>();
      likesData?.forEach(like => {
        likesCountMap.set(like.message_id, (likesCountMap.get(like.message_id) || 0) + 1);
        if (like.user_id === user.id) {
          userLikesSet.add(like.message_id);
        }
      });

      // Fetch replies
      const {
        data: repliesData
      } = await supabase.from('message_replies').select('*').in('message_id', messageIds).order('created_at', {
        ascending: true
      });

      // Replies now include anonymous_name directly (auto-populated by trigger)
      // No need to look up profiles separately

      const repliesMap = new Map<string, Reply[]>();
      repliesData?.forEach(reply => {
        const existing = repliesMap.get(reply.message_id) || [];
        existing.push({
          id: reply.id,
          content: reply.content,
          created_at: reply.created_at,
          anonymous_name: (reply as any).anonymous_name || 'Anonymous'
        });
        repliesMap.set(reply.message_id, existing);
      });

      // Build full messages - anonymous_name is now stored directly in the message
      const fullMessages: Message[] = messagesData.map(msg => ({
        id: msg.id,
        content: msg.content,
        created_at: msg.created_at,
        user_id: msg.user_id,
        community_id: msg.community_id,
        anonymous_name: (msg as any).anonymous_name || 'Anonymous',
        likes_count: likesCountMap.get(msg.id) || 0,
        user_liked: userLikesSet.has(msg.id),
        replies: repliesMap.get(msg.id) || []
      }));
      setMessages(fullMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };
  const handleSendMessage = async () => {
    if (!message.trim() || !user || !selectedCommunity) return;
    setErrorMessage(null);

    // Client-side rate limiting (3 second cooldown)
    const now = Date.now();
    if (now - lastMessageTime < 3000) {
      setErrorMessage('Please wait a moment before sending another message');
      return;
    }

    // Length validation
    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      setErrorMessage(`Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);
      return;
    }
    if (containsBadWord(message)) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
      return;
    }
    setLastMessageTime(now);
    const {
      error
    } = await supabase.from('community_messages').insert({
      content: message.trim(),
      user_id: user.id,
      community_id: selectedCommunity.id
    });
    if (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Failed to send message. Please try again.');
    } else {
      setMessage('');
    }
  };
  const handleLike = async (messageId: string, userLiked: boolean) => {
    if (!user) return;
    if (userLiked) {
      await supabase.from('message_likes').delete().eq('message_id', messageId).eq('user_id', user.id);
    } else {
      await supabase.from('message_likes').insert({
        message_id: messageId,
        user_id: user.id
      });
    }
  };
  const handleReply = async (messageId: string) => {
    if (!replyText.trim() || !user) return;
    setErrorMessage(null);

    // Client-side rate limiting (2 second cooldown for replies)
    const now = Date.now();
    if (now - lastReplyTime < 2000) {
      setErrorMessage('Please wait a moment before sending another reply');
      return;
    }

    // Length validation
    if (replyText.trim().length > MAX_REPLY_LENGTH) {
      setErrorMessage(`Reply too long (max ${MAX_REPLY_LENGTH} characters)`);
      return;
    }
    if (containsBadWord(replyText)) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
      return;
    }
    setLastReplyTime(now);
    const {
      error
    } = await supabase.from('message_replies').insert({
      content: replyText.trim(),
      message_id: messageId,
      user_id: user.id
    });
    if (!error) {
      setReplyText('');
      setReplyingTo(null);
    } else {
      console.error('Error sending reply:', error);
      setErrorMessage('Failed to send reply. Please try again.');
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  if (loading) {
    return <Layout showBackButton>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>;
  }
  if (!user) {
    return <Layout showBackButton>
        <div className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-light mb-6">
              <Users className="w-10 h-10 text-secondary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Join Our Community</h1>
            <p className="text-muted-foreground mb-8">
              Sign up or log in to connect with others in our supportive communities.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105">
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </Layout>;
  }
  if (selectedCommunity) {
    return <Layout showBackButton>
        <div className="min-h-screen flex flex-col px-6 py-24">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedCommunity(null)} className="p-3 rounded-2xl bg-muted hover:bg-muted/80 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className={`p-3 rounded-2xl ${selectedCommunity.gradient}`}>
                  {selectedCommunity.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{selectedCommunity.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCommunity.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {profile?.anonymous_name}
                </span>
                <button onClick={handleSignOut} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-card rounded-3xl p-6 shadow-card mb-6 overflow-y-auto max-h-[50vh]">
              {loadingMessages ? <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div> : messages.length === 0 ? <div className="text-center text-muted-foreground py-8">
                  <p>No messages yet. Be the first to share! 💜</p>
                </div> : <div className="space-y-4">
                  {messages.map(msg => <div key={msg.id} className="space-y-2">
                      <div className={`flex ${msg.user_id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${msg.user_id === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'} rounded-2xl px-4 py-3`}>
                          <p className={`text-xs font-medium mb-1 ${msg.user_id === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {msg.anonymous_name}
                          </p>
                          <p className="mb-2">{msg.content}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <button
                              onClick={() => handleLike(msg.id, msg.user_liked)}
                              className={`flex items-center gap-1 transition-colors ${msg.user_liked ? 'text-pink-400' : msg.user_id === user.id ? 'text-primary-foreground/70 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {msg.likes_count > 0 && msg.likes_count}
                            </button>
                            <button
                              onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                              className={`flex items-center gap-1 transition-colors ${msg.user_id === user.id ? 'text-primary-foreground/70 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                              <MessageCircle className="w-3 h-3" />
                              {msg.replies.length > 0 && msg.replies.length}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {msg.replies.length > 0 && <div className={`space-y-2 ${msg.user_id === user.id ? 'pr-8' : 'pl-8'}`}>
                          {msg.replies.map(reply => <div key={reply.id} className={`flex ${msg.user_id === user.id ? 'justify-end' : 'justify-start'}`}>
                              <div className="max-w-[70%] bg-muted/50 rounded-xl px-4 py-2 text-sm">
                                <p className="text-xs font-medium text-muted-foreground mb-1">{reply.anonymous_name}</p>
                                <p className="text-foreground">{reply.content}</p>
                              </div>
                            </div>)}
                        </div>}

                      {/* Reply Input */}
                      {replyingTo === msg.id && <div className={`space-y-1 ${msg.user_id === user.id ? 'pr-8' : 'pl-8'}`}>
                          <div className="flex gap-2">
                            <input type="text" className="flex-1 px-4 py-2 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground text-sm safe-input" placeholder="Write a reply..." value={replyText} onChange={e => {
                      setReplyText(e.target.value);
                      setErrorMessage(null);
                    }} onKeyDown={e => e.key === 'Enter' && handleReply(msg.id)} maxLength={MAX_REPLY_LENGTH} />
                            <button onClick={() => handleReply(msg.id)} className="p-2 bg-primary text-primary-foreground rounded-xl transition-all hover:scale-105">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground text-right pr-10">
                            {replyText.length}/{MAX_REPLY_LENGTH}
                          </p>
                        </div>}
                    </div>)}
                </div>}
            </div>

            {/* Warning */}
            {showWarning && <div className="mb-4 p-4 bg-destructive/50 rounded-2xl text-center animate-fade-in">
                <p className="text-destructive-foreground">
                  💜 Let's keep this space kind and supportive.
                </p>
              </div>}

            {/* Error Message */}
            {errorMessage && <div className="mb-4 p-4 bg-destructive/20 border border-destructive/30 rounded-2xl text-center animate-fade-in">
                <p className="text-destructive-foreground text-sm">{errorMessage}</p>
              </div>}

            {/* Input */}
            <div className="space-y-2">
              <div className="flex gap-3">
                <input type="text" className="flex-1 px-5 py-4 rounded-2xl bg-card border border-border focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground safe-input" placeholder="Type gently… this is a safe space." value={message} onChange={e => {
                setMessage(e.target.value);
                setErrorMessage(null);
              }} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} maxLength={MAX_MESSAGE_LENGTH} />
                <button onClick={handleSendMessage} className="p-4 bg-primary text-primary-foreground rounded-2xl shadow-soft btn-glow transition-all hover:scale-105">
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-right pr-16">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </p>
            </div>
          </div>
        </div>
      </Layout>;
  }
  return <Layout showBackButton>
      <div className="min-h-screen px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center flex-1 opacity-0 animate-fade-in-up" style={{
            animationFillMode: 'forwards'
          }}>
              <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Community</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Safe spaces where you belong. Connect with others who understand.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {profile?.anonymous_name}
              </span>
              <button onClick={handleSignOut} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {communities.map((community, index) => <div key={community.id} onClick={() => setSelectedCommunity(community)} className={`${community.gradient} p-6 rounded-3xl shadow-card card-hover cursor-pointer opacity-0 animate-fade-in-up`} style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards'
          }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-card/80 rounded-2xl">
                    {community.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{community.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{community.description}</p>
                    
                  </div>
                </div>
                <button className="mt-4 w-full py-3 bg-card/80 text-foreground rounded-2xl font-medium hover:bg-card transition-colors">
                  Join Community
                </button>
              </div>)}
          </div>
        </div>
      </div>
    </Layout>;
};
export default Communities;