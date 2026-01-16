import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
  fullName: z.string().trim().min(2, 'Full name is required').max(100, 'Full name too long (max 100 characters)'),
  anonymousName: z.string().trim().min(2, 'Anonymous name is required').max(50, 'Anonymous name too long (max 50 characters)'),
});

const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255, 'Email too long'),
  password: z.string().min(1, 'Password is required').max(128, 'Password too long'),
});

interface AuthProps {
  redirectTo?: string;
}

const Auth = ({ redirectTo = '/' }: AuthProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repeatPassword: '',
    fullName: '',
    anonymousName: '',
  });

  const { user, signUp, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate signup form
        const result = signUpSchema.safeParse({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          anonymousName: formData.anonymousName,
        });

        if (!result.success) {
          setError(result.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.repeatPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          formData.anonymousName
        );

        if (error) {
          if (error.message.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(error.message);
          }
        }
      } else {
        // Validate signin form
        const result = signInSchema.safeParse({
          email: formData.email,
          password: formData.password,
        });

        if (!result.success) {
          setError(result.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);

        if (error) {
          if (error.message.includes('Invalid login')) {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(error.message);
          }
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="text-center mb-10 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-light mb-6">
            <Users className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isSignUp ? 'Join MindNest' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Create your safe space identity' : 'Enter your sanctuary'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/20 border border-destructive/30 rounded-2xl text-destructive-foreground text-center animate-fade-in">
            {error}
          </div>
        )}

        <form 
          onSubmit={handleSubmit}
          className="bg-card rounded-3xl p-8 shadow-card opacity-0 animate-fade-in-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground safe-input"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {isSignUp && (
            <>
              <div className="mb-5">
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground safe-input"
                  placeholder="Your real name (private)"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-foreground mb-2">Anonymous Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground safe-input"
                  placeholder="How others will see you"
                  value={formData.anonymousName}
                  onChange={(e) => setFormData({ ...formData, anonymousName: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground safe-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {isSignUp && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Repeat Password</label>
              <input
                type="password"
                required
                className="w-full px-5 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground safe-input"
                placeholder="••••••••"
                value={formData.repeatPassword}
                onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })}
              />
              {formData.password !== formData.repeatPassword && formData.repeatPassword && (
                <p className="text-destructive-foreground text-sm mt-2">Passwords don't match</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold shadow-soft btn-glow transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait...' : isSignUp ? 'Create Safe Space' : 'Enter Safely'}
          </button>

          <p className="text-center text-muted-foreground mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
