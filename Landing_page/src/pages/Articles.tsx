import { useState } from 'react';
import { ArrowLeft, Clock, Heart } from 'lucide-react';
import Layout from '@/components/Layout';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  topic: string;
  readTime: number;
  gradient: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: A Gentle Guide',
    excerpt: 'Learn to recognize anxiety signals and discover calming techniques that actually work.',
    content: `Anxiety is your mind's way of preparing for perceived threats. While uncomfortable, it's a natural response that has helped humans survive for thousands of years.

**Recognizing Anxiety**

Physical symptoms often include:
- Racing heart or palpitations
- Shallow breathing
- Tension in shoulders and neck
- Difficulty sleeping

**Gentle Coping Techniques**

1. **Box Breathing**: Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat.

2. **Grounding Exercise**: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.

3. **Progressive Muscle Relaxation**: Slowly tense and release each muscle group, starting from your toes.

Remember, anxiety doesn't define you. It's just a visitor, and visitors always leave eventually.`,
    topic: 'Anxiety',
    readTime: 5,
    gradient: 'bg-lavender-light',
  },
  {
    id: '2',
    title: 'Breaking Free from Overthinking',
    excerpt: 'Simple strategies to quiet the endless loop of thoughts that keep you up at night.',
    content: `Overthinking is like being stuck in a maze of your own making. The more you try to think your way out, the more lost you become.

**Why We Overthink**

Our brains are pattern-recognition machines. When faced with uncertainty, they try to analyze every possible outcome. This was useful for our ancestors, but in modern life, it often creates more stress than safety.

**Practical Steps to Freedom**

1. **Time-Box Your Thinking**: Set a 10-minute timer. Think deeply about the issue, then stop when the timer goes off.

2. **Write It Down**: Transfer thoughts from your mind to paper. This creates distance and perspective.

3. **Ask "Will This Matter?"**: Consider if this issue will matter in 5 years. If not, it may not deserve 5 hours of thought.

4. **Physical Movement**: Sometimes the best way to escape the mind is through the body. A short walk can reset your thinking.

The goal isn't to stop thinking—it's to think with intention rather than compulsion.`,
    topic: 'Overthinking',
    readTime: 6,
    gradient: 'bg-peach-light',
  },
  {
    id: '3',
    title: 'The Art of Self-Love',
    excerpt: 'Discover how treating yourself with kindness can transform your relationship with yourself.',
    content: `Self-love isn't selfish—it's the foundation from which you can genuinely love others. Think of it as filling your own cup so you have something to pour.

**What Self-Love Actually Means**

It's not about bubble baths and face masks (though those can help). It's about:
- Speaking to yourself as you would to a dear friend
- Setting boundaries that protect your peace
- Accepting your imperfections as part of being human
- Celebrating small wins, not just major achievements

**Daily Self-Love Practices**

1. **Morning Affirmation**: Before checking your phone, tell yourself one thing you appreciate about who you are.

2. **The "Good Enough" Mindset**: Progress over perfection. Done is better than perfect.

3. **Compassionate Self-Talk**: When you make a mistake, ask "What would I say to a friend in this situation?"

4. **Joyful Movement**: Move your body in ways that feel good, not punishing.

You are worthy of love simply because you exist. No achievements required.`,
    topic: 'Self-Love',
    readTime: 5,
    gradient: 'bg-sage-light',
  },
  {
    id: '4',
    title: 'Mindfulness for Beginners',
    excerpt: 'A practical introduction to being present, without the pressure to be perfect at it.',
    content: `Mindfulness isn't about emptying your mind or achieving enlightenment. It's simply about being present, wherever you are.

**The Basics**

Mindfulness means paying attention to the present moment without judgment. That's it. No lotus position required.

**Simple Ways to Practice**

1. **Mindful Eating**: For one meal, eat without screens. Notice the colors, textures, and flavors of your food.

2. **Walking Meditation**: Feel your feet connect with the ground with each step. Notice the rhythm of your movement.

3. **One Conscious Breath**: Throughout the day, take one deep breath with full attention. That's mindfulness.

4. **Body Scan**: Slowly move your attention from your toes to the top of your head, noticing sensations.

**Common Misconceptions**

- You don't need to meditate for hours
- Your mind will wander—that's normal
- There's no "right way" to feel
- Restlessness is part of the practice

Start with just 1 minute. You can do anything for one minute.`,
    topic: 'Mindfulness',
    readTime: 4,
    gradient: 'bg-sky-light',
  },
  {
    id: '5',
    title: 'Healing from Stress',
    excerpt: 'Understanding your body\'s stress response and learning to restore calm naturally.',
    content: `Stress isn't inherently bad—it's your body's way of rising to challenges. But chronic stress can take a toll. Let's learn to work with our stress response, not against it.

**Understanding Your Stress Response**

When stressed, your body activates the "fight or flight" response. This is helpful in emergencies but exhausting when constantly triggered by emails and deadlines.

**Signs of Chronic Stress**

- Difficulty sleeping or sleeping too much
- Changes in appetite
- Irritability or mood swings
- Difficulty concentrating
- Physical tension, especially in neck and shoulders

**Natural Stress Relief**

1. **Vagus Nerve Activation**: Splash cold water on your face, hum, or gargle. These simple acts activate your body's "rest and digest" system.

2. **Nature Time**: Even 20 minutes in green spaces can lower cortisol levels.

3. **Social Connection**: Meaningful conversations reduce stress hormones.

4. **Sleep Hygiene**: A consistent sleep schedule is one of the most powerful stress reducers.

5. **Boundaries**: Learning to say "no" is an act of self-preservation.

Your nervous system learned to be stressed. It can learn to be calm again.`,
    topic: 'Stress',
    readTime: 6,
    gradient: 'bg-lavender-light',
  },
  {
    id: '6',
    title: 'Building Healthy Sleep Habits',
    excerpt: 'Transform your nights with gentle practices that invite restful, restorative sleep.',
    content: `Sleep is not a luxury—it's a necessity for mental and physical health. Yet so many of us struggle to get the rest we need.

**Why Sleep Matters**

During sleep, your brain processes emotions, consolidates memories, and repairs your body. Chronic sleep deprivation affects mood, cognition, and even immune function.

**Creating a Sleep Sanctuary**

1. **Consistent Schedule**: Go to bed and wake up at the same time, even on weekends.

2. **Cool, Dark Environment**: Keep your room between 65-68°F and use blackout curtains.

3. **Digital Sunset**: Stop screens 1 hour before bed. The blue light suppresses melatonin.

4. **Wind-Down Ritual**: Create a calming routine—gentle stretching, reading, or a warm bath.

**When You Can't Sleep**

- Don't watch the clock—it increases anxiety
- If awake for 20+ minutes, get up and do something calming in dim light
- Practice progressive muscle relaxation or body scan meditation
- Write down worries to "park" them for tomorrow

Sleep will come. Trust your body's natural rhythms.`,
    topic: 'Sleep',
    readTime: 5,
    gradient: 'bg-sky-light',
  },
  {
    id: '7',
    title: 'Navigating Loneliness',
    excerpt: 'Understanding the difference between being alone and feeling lonely, and finding connection.',
    content: `Loneliness is one of the most universal human experiences, yet we rarely talk about it. You can feel lonely in a crowd or content in solitude—it's about the quality of connection, not quantity.

**Understanding Loneliness**

Loneliness is a signal, like hunger or thirst. It tells us we need meaningful connection. There's no shame in feeling lonely—it means you're human.

**Types of Loneliness**

- **Emotional**: Missing a close confidant or partner
- **Social**: Lacking a wider friend group or community
- **Existential**: Feeling disconnected from meaning or purpose

**Building Connection**

1. **Start Small**: A genuine "how are you?" to a neighbor or colleague can be the beginning.

2. **Shared Activities**: Join a class, club, or volunteer group around your interests.

3. **Nurture Existing Relationships**: Reach out to someone you've lost touch with.

4. **Be Vulnerable**: Authentic connection requires showing your true self.

5. **Self-Compassion**: Be a good friend to yourself first.

You are worthy of connection. It may take time, but belonging is possible.`,
    topic: 'Connection',
    readTime: 5,
    gradient: 'bg-peach-light',
  },
  {
    id: '8',
    title: 'The Power of Gratitude',
    excerpt: 'How shifting your focus to appreciation can transform your mental well-being.',
    content: `Gratitude isn't about ignoring problems or forcing positivity. It's about training your brain to also notice what's good, creating a more balanced perspective.

**The Science of Gratitude**

Research shows that regular gratitude practice can:
- Increase happiness and life satisfaction
- Improve sleep quality
- Strengthen relationships
- Reduce symptoms of depression

**Simple Gratitude Practices**

1. **Three Good Things**: Each evening, write down three things that went well, no matter how small.

2. **Gratitude Letter**: Write a letter to someone who has positively impacted your life.

3. **Mindful Appreciation**: During routine activities, notice one thing you're grateful for.

4. **Gratitude Jar**: Drop notes of thankfulness into a jar. Read them when you need a boost.

**When Gratitude Feels Hard**

On difficult days, start tiny:
- I'm grateful for this breath
- I'm grateful for clean water
- I'm grateful for this moment of rest

Gratitude grows with practice. Start where you are.`,
    topic: 'Gratitude',
    readTime: 4,
    gradient: 'bg-sage-light',
  },
  {
    id: '9',
    title: 'Setting Healthy Boundaries',
    excerpt: 'Learn to protect your energy and peace by setting limits that honor your needs.',
    content: `Boundaries aren't walls—they're bridges that allow healthy relationships to flourish. They communicate how you want to be treated and what you need to thrive.

**Why Boundaries Matter**

Without boundaries, we become resentful, exhausted, and lose touch with our own needs. Healthy boundaries protect your mental health and make relationships more sustainable.

**Types of Boundaries**

- **Physical**: Personal space and privacy
- **Emotional**: Protecting your feelings and energy
- **Time**: How you spend and prioritize your hours
- **Digital**: When and how you're available online

**How to Set Boundaries**

1. **Know Your Limits**: Pay attention to when you feel resentful or drained.

2. **Be Clear and Direct**: "I can't do that" is a complete sentence.

3. **Start Small**: Practice with low-stakes situations first.

4. **Expect Pushback**: People used to you having no boundaries may resist.

5. **Stay Consistent**: Boundaries only work if you maintain them.

**Boundary Scripts**

- "I need some time to think about that before I commit."
- "I'm not available then, but how about...?"
- "I understand you're upset, but I'm not okay with being spoken to that way."

Your needs matter. Honoring them is not selfish—it's necessary.`,
    topic: 'Self-Care',
    readTime: 6,
    gradient: 'bg-lavender-light',
  },
  {
    id: '10',
    title: 'Coping with Change',
    excerpt: 'Finding stability and peace when life feels uncertain and constantly shifting.',
    content: `Change is the only constant, yet our brains resist it. We're wired to seek stability and predict the future. When change happens—especially unwanted change—it can feel destabilizing.

**Why Change Feels Hard**

Your brain sees change as a potential threat. Even positive changes (a new job, a new relationship) require adjustment and can trigger stress responses.

**Navigating Transitions**

1. **Acknowledge Your Feelings**: It's okay to grieve what was, even while moving toward what will be.

2. **Focus on What You Can Control**: Make a list. Your choices, your reactions, your self-care—these are yours.

3. **Create Anchors**: Maintain some routines and rituals that provide stability.

4. **Take It Day by Day**: You don't need to have everything figured out right now.

**Building Resilience**

- **Flexibility**: The ability to bend without breaking
- **Self-Compassion**: Being patient with yourself during adjustment
- **Support**: Leaning on others when needed
- **Meaning-Making**: Finding purpose or lessons in the experience

Change often brings growth, even when it doesn't feel that way. Trust the process.`,
    topic: 'Resilience',
    readTime: 5,
    gradient: 'bg-peach-light',
  },
  {
    id: '11',
    title: 'Understanding Depression',
    excerpt: 'A compassionate look at depression and gentle steps toward finding light again.',
    content: `Depression is more than sadness. It's a heaviness that affects how you think, feel, and function. If you're experiencing depression, please know: it's not your fault, and you're not alone.

**Recognizing Depression**

Common signs include:
- Persistent low mood or emptiness
- Loss of interest in activities you once enjoyed
- Changes in sleep and appetite
- Difficulty concentrating
- Feelings of worthlessness or guilt
- Fatigue and low energy

**Gentle Steps Forward**

1. **Reach Out**: Tell someone you trust how you're feeling. Connection matters.

2. **Tiny Actions**: When everything feels hard, do one small thing—shower, step outside, drink water.

3. **Routine**: Structure can provide stability when motivation is low.

4. **Movement**: Even a 10-minute walk can shift brain chemistry.

5. **Professional Support**: Therapy and sometimes medication can be tremendously helpful.

**What Not to Say to Yourself**

- "I should just snap out of it" (You can't—and that's okay)
- "Other people have it worse" (Your pain is valid)
- "I'm a burden" (Reaching out is brave, not burdensome)

Depression lies to you. Recovery is possible. Be patient with yourself.`,
    topic: 'Depression',
    readTime: 6,
    gradient: 'bg-sky-light',
  },
  {
    id: '12',
    title: 'The Healing Power of Nature',
    excerpt: 'Discover how connecting with the natural world can restore your mind and spirit.',
    content: `Humans evolved in nature, yet most of us now spend 90% of our time indoors. Reconnecting with the natural world isn't just pleasant—it's therapeutic.

**The Science**

Research shows time in nature can:
- Lower cortisol (stress hormone) levels
- Reduce blood pressure and heart rate
- Improve mood and reduce anxiety
- Boost creativity and focus
- Strengthen immune function

**Ways to Connect**

1. **Forest Bathing**: Slowly walk through a natural area, engaging all your senses.

2. **Barefoot Walking**: Feel the earth beneath your feet—grass, sand, soil.

3. **Nature Meditation**: Find a quiet spot outside and simply observe—clouds, trees, birds.

4. **Bring Nature In**: Houseplants, natural light, and nature sounds can help.

5. **Regular Green Time**: Even 20 minutes in a park makes a difference.

**Mindful Nature Observation**

- What colors do you see?
- What sounds can you hear?
- What textures can you feel?
- What scents are in the air?

Nature doesn't ask anything of you. It simply invites you to be present.`,
    topic: 'Wellness',
    readTime: 4,
    gradient: 'bg-sage-light',
  },
];

const Articles = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const topics = ['All', ...new Set(articles.map(a => a.topic))];
  const filteredArticles = filter === 'All' 
    ? articles 
    : articles.filter(a => a.topic === filter);

  if (selectedArticle) {
    return (
      <Layout showBackButton>
        <div className="min-h-screen px-6 py-24">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Articles</span>
            </button>

            <article className="opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              <div className={`${selectedArticle.gradient} rounded-3xl p-6 mb-8`}>
                <span className="text-sm font-medium text-muted-foreground">{selectedArticle.topic}</span>
                <h1 className="text-3xl font-bold text-foreground mt-2 mb-4">{selectedArticle.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedArticle.readTime} min read
                  </span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                {selectedArticle.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-foreground/90 leading-relaxed mb-6 whitespace-pre-wrap">
                    {paragraph.split('**').map((part, j) => 
                      j % 2 === 1 
                        ? <strong key={j} className="text-foreground font-semibold">{part}</strong>
                        : part
                    )}
                  </p>
                ))}
              </div>

              <div className="mt-12 p-6 bg-card rounded-2xl text-center">
                <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Remember, healing is not linear. Be patient with yourself.
                </p>
              </div>
            </article>
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
          <div className="text-center mb-12 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h1 className="text-4xl font-bold text-foreground mb-4">Healing Articles</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Thoughtful reads to help you understand, heal, and grow.
            </p>
          </div>

          {/* Topic Filter */}
          <div 
            className="flex flex-wrap justify-center gap-3 mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => setFilter(topic)}
                className={`px-5 py-2 rounded-full transition-all ${
                  filter === topic 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article, index) => (
              <article
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={`
                  ${article.gradient} p-6 rounded-3xl shadow-card card-hover cursor-pointer
                  opacity-0 animate-fade-in-up
                `}
                style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <span className="text-sm font-medium text-muted-foreground">{article.topic}</span>
                <h2 className="text-xl font-semibold text-foreground mt-2 mb-3">{article.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {article.readTime} min read
                  </span>
                  <span className="text-primary font-medium text-sm">Read More →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Articles;
