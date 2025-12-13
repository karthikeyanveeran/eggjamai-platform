
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './PlatformAdminDashboard.css'

function PlatformAdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [configs, setConfigs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'ai_gateway', label: '🤖 AI Models', icon: '🤖' },
    { id: 'billing', label: '💰 Billing', icon: '💰' },
    { id: 'roles', label: '👥 Roles', icon: '👥' },
    { id: 'partner', label: '🤝 Partners', icon: '🤝' },
    { id: 'regional', label: '🌍 Regional', icon: '🌍' },
    { id: 'marketing', label: '📢 Marketing', icon: '📢' },
    { id: 'advertisement', label: '📺 Ads', icon: '📺' },
    { id: 'landing_page', label: '🏠 Landing Page', icon: '🏠' },
    { id: 'account', label: '🔐 Account Security', icon: '🔐' },
    { id: 'system', label: '⚙️ System', icon: '⚙️' },
    { id: 'api', label: '🔌 API', icon: '🔌' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [configsData, statsData] = await Promise.all([
        api.platformAdmin.getAllConfigs(),
        api.platformAdmin.getStats()
      ])
      setConfigs(configsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateConfig = async (key, field, value) => {
    const config = configs.find(c => c.key === key)
    if (!config) return

    const newValue = { ...config.value, [field]: value }
    
    // Optimistic update
    const updatedConfigs = configs.map(c => 
      c.key === key ? { ...c, value: newValue } : c
    )
    setConfigs(updatedConfigs)

    try {
      setSaving(true)
      await api.platformAdmin.updateConfig(key, {
        value: newValue,
        updated_by: user.email
      })
    } catch (error) {
      console.error('Failed to save config', error)
      alert('Failed to save changes')
      fetchData() // Revert
    } finally {
      setSaving(false)
    }
  }

  const renderToggle = (key, field, label, value) => (
    <div className="config-item toggle">
      <div className="config-label">
        <label>{label}</label>
      </div>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={value} 
          onChange={(e) => handleUpdateConfig(key, field, e.target.checked)}
        />
        <span className="slider round"></span>
      </label>
    </div>
  )

  const renderInput = (key, field, label, value, type = "text") => (
    <div className="config-item input">
      <label>{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => handleUpdateConfig(key, field, type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </div>
  )

  const renderSelect = (key, field, label, value, options) => (
    <div className="config-item select">
      <label>{label}</label>
      <select 
        value={value} 
        onChange={(e) => handleUpdateConfig(key, field, e.target.value)}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )

  const renderConfigSection = (category) => {
    const config = configs.find(c => c.category === category)
    if (!config) return <div className="empty-config">Configuration not initialized. Restart backend to seed defaults.</div>

    const { key, value } = config

    return (
      <div className="config-section glass-panel">
        <div className="section-header">
          <h3>{config.description}</h3>
          {saving && <span className="saving-indicator">Saving...</span>}
        </div>

        <div className="config-grid">
          {/* AI Gateway */}
          {category === 'ai_gateway' && (
            <>
              {renderSelect(key, 'provider', 'AI Provider', value.provider, [
                { value: 'openai', label: 'OpenAI (GPT)' },
                { value: 'anthropic', label: 'Anthropic (Claude)' },
                { value: 'azure', label: 'Azure OpenAI' }
              ])}
              {renderInput(key, 'model', 'Model Name', value.model)}
              {renderInput(key, 'temperature', 'Temperature (Creativity)', value.temperature, 'number')}
              {renderInput(key, 'max_tokens', 'Max Tokens', value.max_tokens, 'number')}
            </>
          )}

          {/* Billing */}
          {category === 'billing' && (
            <>
              {renderInput(key, 'student_monthly', 'Student Monthly Price (₹)', value.student_monthly, 'number')}
              {renderInput(key, 'student_yearly', 'Student Yearly Price (₹)', value.student_yearly, 'number')}
              {renderInput(key, 'school_license_base', 'School Base License (₹)', value.school_license_base, 'number')}
              {renderToggle(key, 'discount_enabled', 'Enable Global Discounts', value.discount_enabled)}
            </>
          )}

          {/* Roles */}
          {category === 'roles' && (
            <>
              {renderSelect(key, 'default_student_role', 'Default Role', value.default_student_role, [
                { value: 'student', label: 'Student' },
                { value: 'guest', label: 'Guest' }
              ])}
              {renderToggle(key, 'admin_can_delete_users', 'Admins Can Delete Users', value.admin_can_delete_users)}
              {renderToggle(key, 'teacher_can_view_analytics', 'Teachers View Analytics', value.teacher_can_view_analytics)}
              {renderInput(key, 'counselor_max_students', 'Max Students per Counselor', value.counselor_max_students, 'number')}
            </>
          )}

          {/* Partner */}
          {category === 'partner' && (
            <>
              {renderToggle(key, 'enable_resellers', 'Enable Reseller Program', value.enable_resellers)}
              {renderToggle(key, 'partner_api_access', 'Allow Partner API Access', value.partner_api_access)}
              {renderToggle(key, 'whitelabel_enabled', 'Enable White-labeling', value.whitelabel_enabled)}
              {renderInput(key, 'revenue_share_percentage', 'Revenue Share (%)', value.revenue_share_percentage, 'number')}
            </>
          )}

          {/* Regional */}
          {category === 'regional' && (
            <>
              {renderSelect(key, 'default_language', 'Default Language', value.default_language, [
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi' },
                { value: 'es', label: 'Spanish' }
              ])}
              {renderInput(key, 'timezone', 'System Timezone', value.timezone)}
              {renderInput(key, 'data_residency', 'Data Residency Region', value.data_residency)}
            </>
          )}

          {/* Marketing */}
          {category === 'marketing' && (
            <>
              {renderToggle(key, 'enable_referral_program', 'Enable Referral Program', value.enable_referral_program)}
              {renderToggle(key, 'email_campaign_enabled', 'Enable Email Campaigns', value.email_campaign_enabled)}
              {renderInput(key, 'referral_bonus_credits', 'Referral Bonus Credits', value.referral_bonus_credits, 'number')}
            </>
          )}

          {/* Ads */}
          {category === 'advertisement' && (
            <>
              {renderToggle(key, 'enable_ads_free_tier', 'Show Ads on Free Tier', value.enable_ads_free_tier)}
              {renderSelect(key, 'ad_provider', 'Ad Provider', value.ad_provider, [
                { value: 'google_adsense', label: 'Google AdSense' },
                { value: 'facebook_audience', label: 'Facebook Audience Network' }
              ])}
              {renderInput(key, 'ad_frequency_minutes', 'Ad Frequency (Minutes)', value.ad_frequency_minutes, 'number')}
            </>
          )}

          {/* Landing Page */}
          {category === 'landing_page' && (
            <>
              {renderInput(key, 'hero_title', 'Hero Title', value.hero_title)}
              {renderInput(key, 'hero_subtitle', 'Hero Subtitle', value.hero_subtitle)}
              {renderInput(key, 'primary_color', 'Primary Brand Color', value.primary_color, 'color')}
              {renderToggle(key, 'show_testimonials', 'Show Testimonials', value.show_testimonials)}
              {renderToggle(key, 'show_pricing', 'Show Pricing Section', value.show_pricing)}
            </>
          )}

          {/* Account */}
          {category === 'account' && (
            <>
              {renderInput(key, 'password_min_length', 'Min Password Length', value.password_min_length, 'number')}
              {renderInput(key, 'session_timeout_minutes', 'Session Timeout (Mins)', value.session_timeout_minutes, 'number')}
              {renderInput(key, 'max_login_attempts', 'Max Login Attempts', value.max_login_attempts, 'number')}
              {renderToggle(key, 'require_email_verification', 'Require Email Verification', value.require_email_verification)}
            </>
          )}

          {/* System */}
          {category === 'system' && (
            <>
              {renderToggle(key, 'maintenance_mode', '🔴 Maintenance Mode', value.maintenance_mode)}
              {renderToggle(key, 'beta_features', 'Enable Beta Features', value.beta_features)}
              {renderToggle(key, 'video_chat', 'Enable Video Chat', value.video_chat)}
              {renderToggle(key, 'parent_portal', 'Enable Parent Portal', value.parent_portal)}
            </>
          )}

          {/* API */}
          {category === 'api' && (
            <>
              {renderInput(key, 'global_limit', 'Global Rate Limit', value.global_limit, 'number')}
              {renderInput(key, 'student_limit', 'Student Rate Limit', value.student_limit, 'number')}
              {renderInput(key, 'school_limit', 'School Rate Limit', value.school_limit, 'number')}
            </>
          )}
        </div>
      </div>
    )
  }

  if (loading) return <div className="loading">Loading Admin Portal...</div>

  return (
    <div className="platform-admin-container">
      <header className="admin-header">
        <h1 className="text-gradient">⚡ Platform Super Admin</h1>
        <div className="admin-badges">
          <span className="badge">System Status: 🟢 Operational</span>
          <span className="badge">Version: 2.1.0</span>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar glass-panel">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="admin-content">
          {activeTab === 'overview' && stats ? (
            <div className="overview-grid">
              <div className="stat-card glass-panel">
                <h3>Total Users</h3>
                <div className="big-number">{stats.total_users}</div>
              </div>
              <div className="stat-card glass-panel">
                <h3>Active Schools</h3>
                <div className="big-number">{stats.total_schools}</div>
              </div>
              <div className="stat-card glass-panel">
                <h3>AI Token Usage</h3>
                <div className="big-number">{stats.ai_token_usage.toLocaleString()}</div>
              </div>
              <div className="stat-card glass-panel">
                <h3>API Calls (24h)</h3>
                <div className="big-number">{stats.api_calls_today.toLocaleString()}</div>
              </div>
              
              <div className="quick-actions glass-panel full-width">
                <h3>🚀 Quick Actions</h3>
                <div className="action-buttons">
                  <button onClick={() => alert('Cache cleared')}>Clear System Cache</button>
                  <button onClick={() => alert('Services restarted')}>Restart Services</button>
                  <button onClick={() => alert('Maintenance mode toggled')}>Toggle Maintenance Mode</button>
                  <button onClick={() => alert('Backup started')}>Trigger Backup</button>
                </div>
              </div>
            </div>
          ) : (
            renderConfigSection(activeTab)
          )}
        </main>
      </div>
    </div>
  )
}

export default PlatformAdminDashboard
