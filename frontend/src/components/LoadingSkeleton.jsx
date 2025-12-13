import React from 'react';
import './LoadingSkeleton.css';

/**
 * Loading Skeleton Components
 * Beautiful loading states instead of boring spinners
 */

// Card skeleton
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header" />
    <div className="skeleton-text" />
    <div className="skeleton-text short" />
    <div className="skeleton-button" />
  </div>
);

// Message skeleton
export const SkeletonMessage = ({ isUser = false }) => (
  <div className={`skeleton-message ${isUser ? 'user' : 'ai'}`}>
    <div className="skeleton-avatar" />
    <div className="skeleton-message-content">
      <div className="skeleton-text" />
      <div className="skeleton-text short" />
    </div>
  </div>
);

// Dashboard stat skeleton
export const SkeletonStat = () => (
  <div className="skeleton-stat">
    <div className="skeleton-icon" />
    <div className="skeleton-value" />
    <div className="skeleton-label" />
  </div>
);

// List item skeleton
export const SkeletonListItem = () => (
  <div className="skeleton-list-item">
    <div className="skeleton-avatar" />
    <div className="skeleton-list-content">
      <div className="skeleton-text" />
      <div className="skeleton-text short" />
    </div>
  </div>
);

// Table row skeleton
export const SkeletonTableRow = ({ columns = 4 }) => (
  <tr className="skeleton-table-row">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i}>
        <div className="skeleton-text" />
      </td>
    ))}
  </tr>
);

// Chart skeleton
export const SkeletonChart = () => (
  <div className="skeleton-chart">
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        className="skeleton-bar"
        style={{ height: `${Math.random() * 60 + 40}%` }}
      />
    ))}
  </div>
);

// Profile skeleton
export const SkeletonProfile = () => (
  <div className="skeleton-profile">
    <div className="skeleton-avatar-large" />
    <div className="skeleton-text" />
    <div className="skeleton-text short" />
  </div>
);

// Grid skeleton
export const SkeletonGrid = ({ count = 6, component: Component = SkeletonCard }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <Component key={i} />
    ))}
  </div>
);

// Full page skeleton
export const SkeletonPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-header-large" />
    <div className="skeleton-text" />
    <div className="skeleton-text short" />
    <SkeletonGrid count={6} />
  </div>
);

// Pulse loader (for inline loading)
export const PulseLoader = ({ size = 'medium' }) => (
  <div className={`pulse-loader pulse-loader-${size}`}>
    <div className="pulse-dot" />
    <div className="pulse-dot" />
    <div className="pulse-dot" />
  </div>
);

// Spinner loader (for buttons)
export const SpinnerLoader = ({ size = 'medium', color = 'white' }) => (
  <div className={`spinner-loader spinner-loader-${size}`} style={{ borderTopColor: color }} />
);

// Progress bar loader
export const ProgressLoader = ({ progress = 0 }) => (
  <div className="progress-loader">
    <div className="progress-loader-bar" style={{ width: `${progress}%` }} />
  </div>
);

// Shimmer effect wrapper
export const ShimmerWrapper = ({ children, isLoading }) => (
  <div className={`shimmer-wrapper ${isLoading ? 'shimmer-active' : ''}`}>
    {children}
  </div>
);

export default {
  Card: SkeletonCard,
  Message: SkeletonMessage,
  Stat: SkeletonStat,
  ListItem: SkeletonListItem,
  TableRow: SkeletonTableRow,
  Chart: SkeletonChart,
  Profile: SkeletonProfile,
  Grid: SkeletonGrid,
  Page: SkeletonPage,
  Pulse: PulseLoader,
  Spinner: SpinnerLoader,
  Progress: ProgressLoader,
  Shimmer: ShimmerWrapper
};
