import './Resources.css'

const resourceCategories = [
  {
    id: 'coping',
    title: '🛡️ Coping Strategies',
    items: [
      {
        title: 'Deep Breathing Techniques',
        description: 'Learn various breathing exercises to calm your mind',
        link: '/breathing'
      },
      {
        title: 'Grounding Exercises',
        description: 'Stay present using the 5-4-3-2-1 technique',
        content: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste'
      },
      {
        title: 'Progressive Muscle Relaxation',
        description: 'Release physical tension through systematic muscle relaxation',
        content: 'Start with your toes and work up, tensing and relaxing each muscle group'
      },
      {
        title: 'Journaling Prompts',
        description: 'Express your thoughts and feelings through writing',
        content: 'Try: "Today I feel...", "I am grateful for...", "One thing I learned about myself..."'
      }
    ]
  },
  {
    id: 'mindfulness',
    title: '🧘 Mindfulness & Meditation',
    items: [
      {
        title: '5-Minute Meditation',
        description: 'Quick meditation for busy students',
        content: 'Sit comfortably, focus on your breath, observe thoughts without judgment'
      },
      {
        title: 'Body Scan Meditation',
        description: 'Connect with your body and release tension',
        content: 'Lie down, mentally scan from head to toe, notice sensations without changing them'
      },
      {
        title: 'Mindful Walking',
        description: 'Turn a simple walk into a meditation practice',
        content: 'Feel each step, notice your surroundings, breathe naturally'
      },
      {
        title: 'Loving-Kindness Meditation',
        description: 'Cultivate compassion for yourself and others',
        content: 'Repeat: "May I be happy, may I be healthy, may I be at peace"'
      }
    ]
  },
  {
    id: 'academic',
    title: '📚 Academic Stress Management',
    items: [
      {
        title: 'Pomodoro Technique',
        description: 'Study smart with timed intervals',
        content: '25 min focused study + 5 min break. Repeat 4 times, then take a longer break'
      },
      {
        title: 'Time Management Tips',
        description: 'Organize your schedule effectively',
        content: 'Prioritize tasks, break big projects into small steps, use a planner'
      },
      {
        title: 'Exam Anxiety Toolkit',
        description: 'Manage pre-exam stress',
        content: 'Prepare early, practice deep breathing, visualize success, get enough sleep'
      },
      {
        title: 'Healthy Study Habits',
        description: 'Create an optimal learning environment',
        content: 'Regular breaks, good lighting, minimize distractions, stay hydrated'
      }
    ]
  },
  {
    id: 'crisis',
    title: '🆘 Crisis Resources',
    items: [
      {
        title: 'National Mental Health Helpline',
        description: 'Available 24/7 for support',
        content: '08046110007 - Free counseling and support'
      },
      {
        title: 'iCall Helpline',
        description: 'Professional counseling service',
        content: '9152987821 - Mon-Sat, 8 AM to 10 PM'
      },
      {
        title: 'Vandrevala Foundation',
        description: '24x7 mental health helpline',
        content: '1860-2662-345 or 1800-2333-330'
      },
      {
        title: 'Emergency Services',
        description: 'For immediate crisis situations',
        content: '112 - National Emergency Number'
      }
    ]
  },
  {
    id: 'selfcare',
    title: '💚 Self-Care Activities',
    items: [
      {
        title: 'Sleep Hygiene',
        description: 'Improve your sleep quality',
        content: 'Consistent schedule, avoid screens before bed, create a relaxing routine'
      },
      {
        title: 'Physical Activity',
        description: 'Move your body for mental wellness',
        content: 'Even 10 minutes of walking can boost mood. Try yoga, dancing, or sports'
      },
      {
        title: 'Social Connection',
        description: 'Build and maintain relationships',
        content: 'Reach out to friends, join clubs, talk to family, find your community'
      },
      {
        title: 'Creative Expression',
        description: 'Express yourself through art',
        content: 'Draw, paint, write, play music, dance - no judgment, just expression'
      }
    ]
  }
]

function Resources() {
  return (
    <div className="resources-container">
      <header className="resources-header">
        <h1 className="text-gradient">Wellness Resources</h1>
        <p className="subtitle">
          Evidence-based tools and strategies for your mental health journey
        </p>
      </header>

      {resourceCategories.map((category) => (
        <div key={category.id} className="resource-category">
          <h2 className="category-title">{category.title}</h2>
          <div className="resource-grid">
            {category.items.map((item, index) => (
              <div key={index} className="resource-card glass-panel">
                <h3>{item.title}</h3>
                <p className="resource-description">{item.description}</p>
                {item.content && (
                  <div className="resource-content">
                    {item.content}
                  </div>
                )}
                {item.link && (
                  <button className="resource-link">
                    Try Now →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="emergency-banner glass-panel">
        <div className="emergency-icon">🚨</div>
        <div className="emergency-content">
          <h3>In Crisis?</h3>
          <p>If you're experiencing a mental health emergency, please reach out immediately:</p>
          <div className="emergency-contacts">
            <div className="contact-item">
              <strong>National Helpline:</strong> 08046110007
            </div>
            <div className="contact-item">
              <strong>Emergency:</strong> 112
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resources
