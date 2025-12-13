# 🎨 Enhanced UX Features - Usage Guide

## Overview

This guide demonstrates how to use all the enhanced UX features in the EggJam.ai frontend.

---

## 🎉 Confetti Celebrations

### Import

```javascript
import confetti from "../utils/confetti";
```

### Basic Usage

```javascript
// Simple confetti
confetti.basic();

// Achievement unlock (epic celebration)
confetti.achievement();

// Level up (fireworks)
confetti.levelUp();

// Streak milestone (fire effect)
confetti.streak();

// Challenge complete (success burst)
confetti.challengeComplete();

// Mood improvement (gentle)
confetti.moodImprovement();

// School shapes (stars, trophies, fire)
confetti.school();

// Cannon blast from sides
confetti.cannon();

// Snow effect (calm)
confetti.snow();

// Realistic confetti
confetti.realistic();

// Custom emoji confetti
confetti.emoji("🎉", 50);
confetti.emoji("🏆", 30);

// Rainbow confetti
confetti.rainbow();

// Continuous celebration (5 seconds)
confetti.continuous(5000);
```

### Example: Achievement Unlock

```javascript
import { achievementConfetti } from "../utils/confetti";
import { sounds } from "../utils/soundManager";

const handleAchievementUnlock = () => {
  // Play sound
  sounds.achievement();

  // Show confetti
  achievementConfetti();

  // Show toast notification
  toast.success("Achievement Unlocked! 🏆");
};
```

---

## 🔊 Sound Effects

### Import

```javascript
import {
  sounds,
  playSound,
  toggleSound,
  setVolume,
} from "../utils/soundManager";
```

### Basic Usage

```javascript
// Play specific sounds
sounds.achievement();
sounds.levelUp();
sounds.message();
sounds.messageSent();
sounds.click();
sounds.success();
sounds.error();
sounds.notification();
sounds.streak();
sounds.challengeComplete();
sounds.moodLog();
sounds.breathingBell();
sounds.unlock();
sounds.whoosh();
sounds.pop();

// Play with custom options
playSound("achievement", { volume: 0.8 });
playSound("message", { volume: 0.3, loop: true });

// Control sound
toggleSound(); // Toggle on/off
setVolume(0.7); // Set volume (0-1)
```

### Example: Button Click

```javascript
import { sounds } from "../utils/soundManager";

const MyButton = () => {
  const handleClick = () => {
    sounds.click();
    // ... rest of logic
  };

  return <button onClick={handleClick}>Click Me</button>;
};
```

### Example: Message Sent

```javascript
const sendMessage = async () => {
  try {
    await api.sendMessage(message);
    sounds.messageSent();
    toast.success("Message sent!");
  } catch (error) {
    sounds.error();
    toast.error("Failed to send message");
  }
};
```

---

## 💬 Toast Notifications

### Import

```javascript
import toast, { ToastProvider, useToast } from "../components/Toast";
```

### Setup (in App.jsx)

```javascript
import { ToastProvider } from "./components/Toast";

function App() {
  return <ToastProvider>{/* Your app content */}</ToastProvider>;
}
```

### Basic Usage (Standalone)

```javascript
// Success
toast.success("Challenge completed!");
toast.success("Achievement unlocked!", 5000); // Custom duration

// Error
toast.error("Failed to save");
toast.error("Network error", 4000);

// Warning
toast.warning("Low battery");
toast.warning("Session expiring soon");

// Info
toast.info("New feature available");
toast.info("Tip: Try the breathing exercise");

// Loading (stays until manually removed)
const loadingId = toast.loading("Processing...");
// Later: remove it
// (You'll need to implement remove in standalone mode)
```

### Usage with Hook

```javascript
import { useToast } from "../components/Toast";

const MyComponent = () => {
  const toast = useToast();

  const handleSave = async () => {
    const loadingId = toast.loading("Saving...");

    try {
      await api.save(data);
      toast.remove(loadingId);
      toast.success("Saved successfully!");
    } catch (error) {
      toast.remove(loadingId);
      toast.error("Failed to save");
    }
  };

  return <button onClick={handleSave}>Save</button>;
};
```

---

## ⏳ Loading Skeletons

### Import

```javascript
import Skeleton from "../components/LoadingSkeleton";
```

### Basic Usage

```javascript
// Card skeleton
{
  loading ? <Skeleton.Card /> : <ActualCard />;
}

// Message skeleton
{
  loading ? <Skeleton.Message /> : <MessageList />;
}
{
  loading ? <Skeleton.Message isUser /> : <UserMessage />;
}

// Stat skeleton
{
  loading ? <Skeleton.Stat /> : <StatCard />;
}

// List item skeleton
{
  loading ? <Skeleton.ListItem /> : <ListItem />;
}

// Table row skeleton
{
  loading ? <Skeleton.TableRow columns={5} /> : <TableRow />;
}

// Chart skeleton
{
  loading ? <Skeleton.Chart /> : <Chart />;
}

// Profile skeleton
{
  loading ? <Skeleton.Profile /> : <ProfileCard />;
}

// Grid of skeletons
{
  loading ? <Skeleton.Grid count={6} /> : <CardGrid />;
}

// Full page skeleton
{
  loading ? <Skeleton.Page /> : <PageContent />;
}
```

### Loaders

```javascript
// Pulse loader (for inline loading)
<Skeleton.Pulse size="small" />
<Skeleton.Pulse size="medium" />
<Skeleton.Pulse size="large" />

// Spinner loader (for buttons)
<Skeleton.Spinner size="small" color="white" />
<Skeleton.Spinner size="medium" color="#667eea" />

// Progress bar
<Skeleton.Progress progress={75} />

// Shimmer wrapper
<Skeleton.Shimmer isLoading={loading}>
  <YourContent />
</Skeleton.Shimmer>
```

### Example: Dashboard

```javascript
import Skeleton from "../components/LoadingSkeleton";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <Skeleton.Grid count={4} component={Skeleton.Stat} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
};
```

---

## ✨ Particle Backgrounds

### Import

```javascript
import Particles from "../components/ParticleBackground";
```

### Basic Usage

```javascript
// Canvas particle network
<Particles.Particles
  particleCount={50}
  color="#667eea"
  speed={1}
  size={2}
/>

// Floating particles (emojis)
<Particles.Floating count={20} emoji="✨" />
<Particles.Floating count={15} emoji="🌟" />

// Bubble effect
<Particles.Bubbles count={15} />

// Stars background
<Particles.Stars count={100} />

// Gradient orbs
<Particles.Orbs count={3} />
```

### Example: Achievement Page

```javascript
import Particles from "../components/ParticleBackground";

const AchievementsPage = () => {
  return (
    <div className="achievements-page">
      <Particles.Stars count={50} />
      <Particles.Floating count={10} emoji="🏆" />

      {/* Your content */}
      <h1>Achievements</h1>
      {/* ... */}
    </div>
  );
};
```

---

## 🔊 Sound Control

### Import

```javascript
import {
  SoundControl,
  SoundToggle,
  VolumeSlider,
} from "../components/SoundControl";
```

### Basic Usage

```javascript
// Full sound control (with settings panel)
<SoundControl position="bottom-right" />
<SoundControl position="bottom-left" />
<SoundControl position="top-right" />
<SoundControl position="top-left" />

// Compact toggle button
<SoundToggle />

// Volume slider
<VolumeSlider />
```

### Example: Add to App

```javascript
import { SoundControl } from "./components/SoundControl";

function App() {
  return (
    <div className="app">
      {/* Your app content */}

      {/* Sound control in bottom-right corner */}
      <SoundControl position="bottom-right" />
    </div>
  );
}
```

---

## 🎯 Complete Examples

### Example 1: Achievement Unlock Flow

```javascript
import confetti from "../utils/confetti";
import { sounds } from "../utils/soundManager";
import toast from "../components/Toast";

const unlockAchievement = (achievement) => {
  // 1. Play sound
  sounds.achievement();

  // 2. Show confetti
  confetti.achievement();

  // 3. Show toast
  toast.success(`Achievement Unlocked: ${achievement.name}! 🏆`, 5000);

  // 4. Update state
  setAchievements((prev) => [...prev, achievement]);
};
```

### Example 2: Level Up Celebration

```javascript
const handleLevelUp = (newLevel) => {
  // Sound
  sounds.levelUp();

  // Confetti
  confetti.levelUp();

  // Toast
  toast.success(`Level Up! You're now Level ${newLevel}! 🎉`, 5000);

  // Update UI
  setLevel(newLevel);
};
```

### Example 3: Challenge Complete

```javascript
const completeChallenge = async (challengeId) => {
  const loadingId = toast.loading("Completing challenge...");

  try {
    await api.completeChallenge(challengeId);

    // Remove loading
    toast.remove(loadingId);

    // Success feedback
    sounds.challengeComplete();
    confetti.challengeComplete();
    toast.success("Challenge completed! +50 XP 🎯");
  } catch (error) {
    toast.remove(loadingId);
    sounds.error();
    toast.error("Failed to complete challenge");
  }
};
```

### Example 4: Mood Log with Feedback

```javascript
const logMood = async (moodData) => {
  try {
    await api.logMood(moodData);

    // Feedback based on mood
    if (moodData.score >= 8) {
      sounds.success();
      confetti.moodImprovement();
      toast.success('Great mood! Keep it up! 😊');
    } else if (moodData.score >= 5) {
      sounds.moodLog();
      toast.info('Mood logged successfully');
    } else {
      sounds.moodLog();
      toast.info('Mood logged. Remember, we're here for you 💙');
    }

  } catch (error) {
    sounds.error();
    toast.error('Failed to log mood');
  }
};
```

### Example 5: Loading State with Skeleton

```javascript
const ChatWindow = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages().then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="chat-window">
      {loading ? (
        <>
          <Skeleton.Message />
          <Skeleton.Message isUser />
          <Skeleton.Message />
        </>
      ) : (
        messages.map((msg) => <Message key={msg.id} {...msg} />)
      )}
    </div>
  );
};
```

---

## 🎨 Best Practices

### 1. Sound Effects

- ✅ Use subtle sounds for frequent actions (clicks, messages)
- ✅ Use celebratory sounds for achievements
- ✅ Always provide a way to mute sounds
- ✅ Respect user's sound preferences

### 2. Confetti

- ✅ Use for significant achievements only
- ✅ Don't overuse (can become annoying)
- ✅ Match confetti type to achievement importance
- ✅ Combine with sound for maximum impact

### 3. Toast Notifications

- ✅ Keep messages concise
- ✅ Use appropriate types (success, error, warning, info)
- ✅ Set reasonable durations (3-5 seconds)
- ✅ Don't stack too many toasts

### 4. Loading States

- ✅ Always show loading feedback
- ✅ Use skeletons instead of spinners when possible
- ✅ Match skeleton to actual content layout
- ✅ Keep loading times minimal

### 5. Particle Effects

- ✅ Use sparingly (performance impact)
- ✅ Reduce particle count on mobile
- ✅ Make them subtle, not distracting
- ✅ Match theme to page context

---

## 📱 Mobile Considerations

### Sound

- Auto-muted on mobile by default
- User must interact before sounds play
- Provide clear toggle button

### Confetti

- Reduce particle count on mobile
- Shorter duration on mobile
- Test performance on low-end devices

### Toast

- Full-width on mobile
- Larger touch targets
- Swipe to dismiss (future enhancement)

### Particles

- Reduce count significantly
- Disable on very small screens
- Use CSS animations instead of canvas

---

## 🚀 Performance Tips

1. **Lazy Load**: Import confetti/particles only when needed
2. **Debounce**: Don't trigger effects too frequently
3. **Cleanup**: Remove event listeners and intervals
4. **Optimize**: Use CSS animations over JavaScript when possible
5. **Test**: Always test on low-end devices

---

## 🎉 Ready to Use!

All enhanced UX features are now available. Start adding them to your components to create an amazing user experience!

**Next**: Integrate these features into existing components like Achievements, Dashboard, ChatWindow, etc.
