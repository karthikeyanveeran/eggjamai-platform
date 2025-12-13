import React, { useState, useEffect } from 'react';
import { toggleSound, setVolume, getVolume, isSoundEnabled } from '../utils/soundManager';
import './SoundControl.css';

/**
 * Sound Control Component
 * Allows users to control sound effects and volume
 */

export const SoundControl = ({ position = 'bottom-right' }) => {
  const [enabled, setEnabled] = useState(isSoundEnabled());
  const [volume, setVolumeState] = useState(getVolume());
  const [showPanel, setShowPanel] = useState(false);

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setVolumeState(newVolume);
  };

  return (
    <div className={`sound-control sound-control-${position}`}>
      <button
        className={`sound-toggle-btn ${enabled ? 'enabled' : 'disabled'}`}
        onClick={handleToggle}
        title={enabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {enabled ? '🔊' : '🔇'}
      </button>

      {showPanel && (
        <div className="sound-panel">
          <div className="sound-panel-header">
            <span>Sound Settings</span>
            <button onClick={() => setShowPanel(false)}>×</button>
          </div>
          
          <div className="volume-control">
            <label>Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              disabled={!enabled}
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>

          <div className="sound-toggle">
            <label>Sound Effects</label>
            <button
              className={`toggle-switch ${enabled ? 'on' : 'off'}`}
              onClick={handleToggle}
            >
              <span className="toggle-slider" />
            </button>
          </div>
        </div>
      )}

      <button
        className="sound-settings-btn"
        onClick={() => setShowPanel(!showPanel)}
        title="Sound settings"
      >
        ⚙️
      </button>
    </div>
  );
};

// Compact sound toggle button
export const SoundToggle = () => {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
  };

  return (
    <button
      className={`sound-toggle-compact ${enabled ? 'enabled' : 'disabled'}`}
      onClick={handleToggle}
      title={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? '🔊' : '🔇'}
    </button>
  );
};

// Volume slider component
export const VolumeSlider = () => {
  const [volume, setVolumeState] = useState(getVolume());
  const [enabled, setEnabled] = useState(isSoundEnabled());

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setVolumeState(newVolume);
  };

  return (
    <div className="volume-slider-container">
      <button
        className="volume-icon"
        onClick={() => {
          const newState = toggleSound();
          setEnabled(newState);
        }}
      >
        {enabled ? (volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔈') : '🔇'}
      </button>
      <input
        type="range"
        className="volume-slider"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        disabled={!enabled}
      />
      <span className="volume-value">{Math.round(volume * 100)}%</span>
    </div>
  );
};

export default SoundControl;
