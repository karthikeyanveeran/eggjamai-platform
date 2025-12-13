import './CrisisAlert.css'

function CrisisAlert({ riskLevel, resources, onClose }) {
  const getRiskColor = (level) => {
    switch(level) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#f59e0b';
      default: return '#3b82f6';
    }
  }

  const getRiskTitle = (level) => {
    switch(level) {
      case 'critical': return '🚨 Immediate Support Needed';
      case 'high': return '⚠️ We\'re Concerned About You';
      case 'medium': return '💭 Let\'s Talk About This';
      default: return 'ℹ️ Helpful Resources';
    }
  }

  return (
    <div className="crisis-alert" style={{ borderColor: getRiskColor(riskLevel) }}>
      <div className="crisis-header">
        <h3>{getRiskTitle(riskLevel)}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="crisis-content">
        {riskLevel === 'critical' && (
          <p className="crisis-message urgent">
            Your safety is our top priority. Please reach out to one of these resources immediately:
          </p>
        )}
        
        {riskLevel === 'high' && (
          <p className="crisis-message">
            We want to make sure you get the support you need. Here are some resources that can help:
          </p>
        )}

        {resources && resources.length > 0 && (
          <ul className="resources-list">
            {resources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        )}

        {(riskLevel === 'critical' || riskLevel === 'high') && (
          <div className="crisis-actions">
            <button className="primary-button">Contact School Counselor</button>
            <button className="secondary-button">View All Resources</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CrisisAlert
