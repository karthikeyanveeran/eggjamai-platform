import { useState, useEffect } from 'react'
import './BreathingExercise.css'

function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('idle') // idle, inhale, hold, exhale
  const [count, setCount] = useState(0)
  const [completedCycles, setCompletedCycles] = useState(0)

  const exercises = [
    {
      id: 'box',
      name: '4-4-4-4 Box Breathing',
      description: 'Used by Navy SEALs for stress relief',
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4
    },
    {
      id: 'calm',
      name: '4-7-8 Calming Breath',
      description: 'Perfect for anxiety and better sleep',
      inhale: 4,
      hold: 7,
      exhale: 8,
      holdAfterExhale: 0
    },
    {
      id: 'energy',
      name: '4-2-6 Energizing Breath',
      description: 'Boost focus and alertness',
      inhale: 4,
      hold: 2,
      exhale: 6,
      holdAfterExhale: 0
    }
  ]

  const [selectedExercise, setSelectedExercise] = useState(exercises[0])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + 1

        // Transition through phases
        if (phase === 'inhale' && newCount > selectedExercise.inhale) {
          setPhase('hold')
          return 1
        }
        if (phase === 'hold' && newCount > selectedExercise.hold) {
          setPhase('exhale')
          return 1
        }
        if (phase === 'exhale' && newCount > selectedExercise.exhale) {
          if (selectedExercise.holdAfterExhale > 0) {
            setPhase('holdAfterExhale')
            return 1
          } else {
            setPhase('inhale')
            setCompletedCycles(c => c + 1)
            return 1
          }
        }
        if (phase === 'holdAfterExhale' && newCount > selectedExercise.holdAfterExhale) {
          setPhase('inhale')
          setCompletedCycles(c => c + 1)
          return 1
        }

        return newCount
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phase, selectedExercise])

  const startExercise = () => {
    setIsActive(true)
    setPhase('inhale')
    setCount(1)
    setCompletedCycles(0)
  }

  const stopExercise = () => {
    setIsActive(false)
    setPhase('idle')
    setCount(0)
  }

  const getPhaseText = () => {
    switch(phase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
      case 'holdAfterExhale': return 'Hold'
      default: return 'Ready to Begin'
    }
  }

  const getPhaseColor = () => {
    switch(phase) {
      case 'inhale': return '#3b82f6'
      case 'hold': return '#8b5cf6'
      case 'exhale': return '#10b981'
      case 'holdAfterExhale': return '#8b5cf6'
      default: return '#6366f1'
    }
  }

  return (
    <div className="breathing-container">
      <header className="breathing-header">
        <h1 className="text-gradient">Breathing Exercises</h1>
        <p className="subtitle">Calm your mind, reduce anxiety, find peace</p>
      </header>

      {!isActive && (
        <div className="exercise-selection">
          <h2>Choose an Exercise</h2>
          <div className="exercise-cards">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`exercise-card glass-panel ${selectedExercise.id === exercise.id ? 'selected' : ''}`}
                onClick={() => setSelectedExercise(exercise)}
              >
                <h3>{exercise.name}</h3>
                <p>{exercise.description}</p>
                <div className="exercise-pattern">
                  {exercise.inhale}-{exercise.hold}-{exercise.exhale}
                  {exercise.holdAfterExhale > 0 && `-${exercise.holdAfterExhale}`}
                </div>
              </div>
            ))}
          </div>

          <button className="start-breathing-button" onClick={startExercise}>
            Start Exercise
          </button>
        </div>
      )}

      {isActive && (
        <div className="breathing-active">
          <div className="cycle-counter">
            <span>Cycle {completedCycles + 1}</span>
          </div>

          <div className="breathing-circle-container">
            <div 
              className={`breathing-circle ${phase}`}
              style={{
                backgroundColor: getPhaseColor(),
                transform: phase === 'inhale' || phase === 'hold' ? 'scale(1.5)' : 'scale(1)'
              }}
            >
              <div className="phase-text">{getPhaseText()}</div>
              <div className="count-text">{count}</div>
            </div>
          </div>

          <div className="breathing-instructions">
            <p className="instruction-text">
              {phase === 'inhale' && 'Slowly breathe in through your nose'}
              {phase === 'hold' && 'Hold your breath gently'}
              {phase === 'exhale' && 'Slowly breathe out through your mouth'}
              {phase === 'holdAfterExhale' && 'Hold with empty lungs'}
            </p>
          </div>

          <button className="stop-button" onClick={stopExercise}>
            Stop Exercise
          </button>

          <div className="completed-cycles">
            Completed Cycles: {completedCycles}
          </div>
        </div>
      )}

      <div className="breathing-benefits glass-panel">
        <h3>Benefits of Breathing Exercises</h3>
        <ul>
          <li>✓ Reduces stress and anxiety</li>
          <li>✓ Improves focus and concentration</li>
          <li>✓ Lowers blood pressure</li>
          <li>✓ Helps with sleep quality</li>
          <li>✓ Increases emotional regulation</li>
        </ul>
      </div>
    </div>
  )
}

export default BreathingExercise
