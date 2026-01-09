import React, { useState, useEffect } from 'react';
import { Activity, Globe, Shield, AlertTriangle, ExternalLink, RefreshCw, Filter } from 'lucide-react';
import { MOCK_EVENTS } from './mockData';

const App = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setEvents(MOCK_EVENTS);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <header className="dashboard-header">
        <div className="title-group">
          <h1>Outbreak Intel</h1>
          <p>Global health intelligence & early signal detection</p>
        </div>
        <button className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-value">{events.length}</div>
          <div className="stat-label">Active Signals</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-value">{new Set(events.flatMap(e => e.diseases)).size}</div>
          <div className="stat-label">Diseases Tracked</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-value">{new Set(events.flatMap(e => e.locations)).size}</div>
          <div className="stat-label">Countries Affected</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-value" style={{ color: 'var(--success)' }}>100%</div>
          <div className="stat-label">System Health</div>
        </div>
      </section>

      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Recent Events</h2>
          <div className="tag glass" style={{ padding: '0.5rem 1rem' }}>
            <Filter size={16} />
            Filters
          </div>
        </div>

        <div className="events-list">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="loading-skeleton" />)
          ) : (
            events.map(event => (
              <div key={event.id} className="event-card glass">
                <div className="event-header">
                  <div>
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <span className="tag">
                        <Globe size={14} />
                        {event.locations.join(', ') || 'Global'}
                      </span>
                      <span className="tag">
                        <Activity size={14} />
                        {event.diseases.join(', ') || 'Unknown Pathogen'}
                      </span>
                      <span className="tag">
                        {new Date(event.published_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${event.signal_classification === 'confirmed_outbreak' ? 'badge-confirmed' : 'badge-early'}`}>
                    {event.signal_classification.replace('_', ' ')}
                  </span>
                </div>
                <div className="event-footer">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={16} color={event.confidence_score > 0.8 ? 'var(--success)' : 'var(--warning)'} />
                      <span>Confidence: {(event.confidence_score * 100).toFixed(0)}% — {event.assessment_text}</span>
                    </div>
                    <a href={event.raw_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      Source <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
