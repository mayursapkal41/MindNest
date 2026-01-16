import { useState, useEffect } from 'react';
import { Check, Dumbbell, Leaf, Heart, Sun, Music, Smile, LogOut, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Task {
  id: string;
  title: string;
  icon: React.ReactNode;
  completed: boolean;
}

const dailyTasks: Omit<Task, 'completed'>[] = [
  { id: '1', title: '30 minutes of workout', icon: <Dumbbell className="w-5 h-5" /> },
  { id: '2', title: '1 hour of learning something new', icon: <BookOpen className="w-5 h-5" /> },
  { id: '3', title: 'Write one thing you are grateful for', icon: <Heart className="w-5 h-5" /> },
  { id: '4', title: 'Take a short walk outside', icon: <Sun className="w-5 h-5" /> },
  { id: '5', title: 'Listen to calming music', icon: <Music className="w-5 h-5" /> },
  { id: '6', title: 'Say something kind to yourself', icon: <Smile className="w-5 h-5" /> },
];

const Challenge = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(() => 
    dailyTasks.map(t => ({ ...t, completed: false }))
  );
  const [streak, setStreak] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedDays, setCompletedDays] = useState<boolean[]>(() => new Array(30).fill(false));
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [waitingForNextDay, setWaitingForNextDay] = useState(false);
  const [todayCompleted, setTodayCompleted] = useState(false);

  // Helper to get time until midnight
  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  };

  // Format time remaining until midnight
  const formatTimeUntilMidnight = () => {
    const ms = getTimeUntilMidnight();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const [timeUntilMidnight, setTimeUntilMidnight] = useState(formatTimeUntilMidnight());

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Check if user needs to wait for next day (until midnight)
  const checkWaitingStatus = (day: number) => {
    const completedAt = localStorage.getItem(`day_${day}_completed_at`);
    if (completedAt) {
      const completedDate = new Date(completedAt);
      const now = new Date();
      
      // Check if we're still on the same calendar day
      const completedDateStr = completedDate.toISOString().split('T')[0];
      const todayStr = now.toISOString().split('T')[0];
      
      if (completedDateStr === todayStr) {
        // Still the same day, need to wait until midnight
        setWaitingForNextDay(true);
        setTimeUntilMidnight(formatTimeUntilMidnight());
        return true;
      } else {
        // It's a new day! Clear the flag and advance
        localStorage.removeItem(`day_${day}_completed_at`);
        setWaitingForNextDay(false);
        return false;
      }
    }
    setWaitingForNextDay(false);
    return false;
  };

  // Load user progress
  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setLoadingProgress(false);
    }
  }, [user]);

  // Timer to check waiting status and update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilMidnight(formatTimeUntilMidnight());
      if (currentDay > 0) {
        const stillWaiting = checkWaitingStatus(currentDay - 1);
        if (!stillWaiting && waitingForNextDay) {
          // Midnight has passed, reload progress to advance to next day
          loadProgress();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDay, waitingForNextDay]);

  const loadProgress = async () => {
    if (!user) return;
    setLoadingProgress(true);

    try {
      // Get or create challenge progress
      const { data: progressData, error: progressError } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (progressError) {
        console.error('Error fetching progress:', progressError);
        setLoadingProgress(false);
        return;
      }

      const today = getTodayDateString();

      if (!progressData) {
        // Create new progress for user
        await supabase
          .from('challenge_progress')
          .insert({
            user_id: user.id,
            current_day: 1,
            streak: 0,
            last_completed_date: null,
          });
        setCurrentDay(1);
        setStreak(0);
      } else {
        // Check if we need to reset based on missed days
        const lastCompleted = progressData.last_completed_date;
        
        if (lastCompleted) {
          const lastDate = new Date(lastCompleted);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays > 1) {
            // Missed a day, reset streak but keep current day
            await supabase
              .from('challenge_progress')
              .update({ streak: 0 })
              .eq('user_id', user.id);
            setStreak(0);
          } else {
            setStreak(progressData.streak);
          }
        } else {
          setStreak(progressData.streak);
        }
        
        // Check if waiting for next day (12 hours haven't passed yet)
        const isWaiting = checkWaitingStatus(progressData.current_day - 1);
        
        if (isWaiting) {
          // User completed previous day but 12 hours haven't passed
          // Show them the current day but in waiting state
          setCurrentDay(progressData.current_day);
        } else {
          setCurrentDay(progressData.current_day);
        }
        
        // Set completed days based on progress
        const newCompletedDays = new Array(30).fill(false);
        for (let i = 0; i < progressData.current_day - 1; i++) {
          newCompletedDays[i] = true;
        }
        setCompletedDays(newCompletedDays);
      }

      // Load today's task completions
      const { data: completions, error: completionsError } = await supabase
        .from('daily_task_completions')
        .select('task_id')
        .eq('user_id', user.id)
        .eq('completed_date', today);

      if (!completionsError && completions) {
        const completedTaskIds = new Set(completions.map(c => c.task_id));
        const updatedTasks = dailyTasks.map(t => ({ 
          ...t, 
          completed: completedTaskIds.has(t.id) 
        }));
        setTasks(updatedTasks);
        
        // Check if all tasks were already completed today
        const allDone = updatedTasks.every(t => t.completed);
        if (allDone && completions.length === dailyTasks.length) {
          setTodayCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!user) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const today = getTodayDateString();

    if (task.completed) {
      // Remove completion
      await supabase
        .from('daily_task_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .eq('completed_date', today);

      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: false } : t
      ));
    } else {
      // Add completion
      await supabase
        .from('daily_task_completions')
        .insert({
          user_id: user.id,
          task_id: taskId,
          completed_date: today,
        });

      const newTasks = tasks.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      );
      setTasks(newTasks);

      // Check if all tasks completed
      const allCompleted = newTasks.every(t => t.completed);
      if (allCompleted) {
        handleDayComplete();
      }
    }
  };

  const handleDayComplete = async () => {
    if (!user || currentDay > 30) return;

    const today = getTodayDateString();

    // Get current progress
    const { data: progressData } = await supabase
      .from('challenge_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!progressData) return;

    // Check if already completed today
    if (progressData.last_completed_date === today) return;

    // Calculate new streak
    const lastCompleted = progressData.last_completed_date;
    let newStreak = 1;
    
    if (lastCompleted) {
      const lastDate = new Date(lastCompleted);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        newStreak = progressData.streak + 1;
      }
    }

    // Update progress
    const newCurrentDay = Math.min(currentDay + 1, 30);
    await supabase
      .from('challenge_progress')
      .update({
        current_day: newCurrentDay,
        streak: newStreak,
        last_completed_date: today,
      })
      .eq('user_id', user.id);

    // Update UI
    setStreak(newStreak);
    const newCompletedDays = [...completedDays];
    newCompletedDays[currentDay - 1] = true;
    setCompletedDays(newCompletedDays);

    // Show celebration - next day tasks will be available after 12 hours
    // Store the completion time in localStorage for client-side gating
    localStorage.setItem(`day_${currentDay}_completed_at`, new Date().toISOString());
    
    setTodayCompleted(true);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  if (loading || loadingProgress) {
    return (
      <Layout showBackButton>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your journey...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout showBackButton>
        <div className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-peach-light mb-6">
              <Heart className="w-10 h-10 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Start Your Journey</h1>
            <p className="text-muted-foreground mb-8">
              Sign up or log in to begin your 30-day wellness challenge and track your progress.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-soft btn-glow transition-all duration-300 hover:scale-105"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBackButton>
      <div className="min-h-screen px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                30 Days of <span className="text-primary">Gentle Healing</span>
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Small steps every day can make a big difference.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {profile?.anonymous_name}
              </span>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Streak Visualization */}
          <div 
            className="mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <div className="bg-card rounded-3xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Your Journey - Day {currentDay}</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-peach-light rounded-full">
                  <span className="text-2xl">🔥</span>
                  <span className="font-bold text-foreground">{streak} day streak</span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-10 gap-2">
                {completedDays.map((completed, i) => (
                  <div
                    key={i}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                      transition-all duration-300
                      ${completed 
                        ? 'bg-primary text-primary-foreground shadow-glow' 
                        : i + 1 === currentDay 
                          ? 'bg-peach-light text-foreground ring-2 ring-primary/50' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today Completed, Waiting State, or Today's Tasks */}
          {todayCompleted ? (
            <div 
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <div className="bg-card rounded-3xl p-8 shadow-card text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Day {currentDay} Complete!</h2>
                <p className="text-muted-foreground mb-4">
                  Amazing work! You've completed all your tasks for today.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-sage-light rounded-full mb-4">
                  <span className="text-lg">🔥</span>
                  <span className="font-medium text-foreground">
                    {streak} day streak added!
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-lavender-light rounded-full">
                  <span className="text-lg">⏰</span>
                  <span className="font-medium text-foreground">
                    Day {currentDay + 1} tasks unlock at midnight (~{timeUntilMidnight})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Rest well and come back tomorrow for more gentle healing 💜
                </p>
              </div>
            </div>
          ) : waitingForNextDay ? (
            <div 
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <div className="bg-card rounded-3xl p-8 shadow-card text-center">
                <div className="text-5xl mb-4">🌙</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Rest & Recharge</h2>
                <p className="text-muted-foreground mb-4">
                  Great job completing Day {currentDay - 1}! Take some time to rest.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-lavender-light rounded-full">
                  <span className="text-lg">⏰</span>
                  <span className="font-medium text-foreground">
                    Day {currentDay} tasks unlock at midnight (~{timeUntilMidnight})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  This helps you build sustainable habits without burnout 💜
                </p>
              </div>
            </div>
          ) : (
            <div 
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Today's Gentle Tasks</h2>
                <span className="text-muted-foreground">{completedCount}/{tasks.length} complete</span>
              </div>

            <div className="grid md:grid-cols-2 gap-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`
                    p-5 rounded-2xl cursor-pointer transition-all duration-500
                    ${task.completed 
                      ? 'bg-sage-light shadow-glow' 
                      : 'bg-card shadow-card hover:shadow-hover'
                    }
                    opacity-0 animate-fade-in-up
                  `}
                  style={{ animationDelay: `${300 + index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                      ${task.completed 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {task.completed ? <Check className="w-6 h-6" /> : task.icon}
                    </div>
                    <span className={`font-medium transition-all duration-300 ${task.completed ? 'text-secondary-foreground line-through' : 'text-foreground'}`}>
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Celebration Modal */}
          {showCelebration && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-card p-10 rounded-3xl shadow-glow text-center animate-scale-in">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Beautiful Work!</h2>
                <p className="text-muted-foreground">You completed all tasks for today.</p>
                <p className="text-primary font-medium mt-2">Day {currentDay + 1} tasks will be available after 12AM</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Challenge;
