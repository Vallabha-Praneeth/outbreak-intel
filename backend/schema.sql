-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sources Table
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 4),
    type TEXT NOT NULL, -- 'RSS', 'API', 'Web', 'Social'
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diseases Master Table (Seeded from XLSX)
CREATE TABLE IF NOT EXISTS diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    pathogen_agent TEXT,
    diagnostic_protocols TEXT,
    symptoms TEXT,
    treatment TEXT,
    vaccine_status TEXT,
    classification_reason TEXT,
    severity_score FLOAT CHECK (severity_score >= 0 AND severity_score <= 10),
    total_case_count INTEGER DEFAULT 0,
    total_death_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raw Events Table (Preserve original data)
CREATE TABLE IF NOT EXISTS raw_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES sources(id),
    external_id TEXT, -- Title or GUID from source
    content TEXT NOT NULL, -- Full text or JSON
    raw_url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_id, external_id)
);

-- Normalized Events
CREATE TABLE IF NOT EXISTS normalized_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_event_id UUID NOT NULL REFERENCES raw_events(id),
    title TEXT NOT NULL,
    summary TEXT,
    signal_classification TEXT NOT NULL, -- 'confirmed_outbreak', 'probable', 'research_update', 'early_signal'
    confidence_score FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    source_tier INTEGER NOT NULL,
    geo_level TEXT, -- 'country', 'region', 'city'
    iso2 TEXT, -- ISO 2-letter country code
    event_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disease Mentions (Link between events and diseases)
CREATE TABLE IF NOT EXISTS disease_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES normalized_events(id),
    disease_id UUID REFERENCES diseases(id),
    disease_name TEXT NOT NULL, -- Store name for redundancy/fuzzy matching
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location Mentions
CREATE TABLE IF NOT EXISTS location_mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES normalized_events(id),
    country TEXT,
    region TEXT,
    city TEXT,
    iso2 TEXT,
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outbreak Assessments
CREATE TABLE IF NOT EXISTS outbreak_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES normalized_events(id),
    assessment_text TEXT NOT NULL,
    case_count INTEGER,
    death_count INTEGER,
    risk_level TEXT, -- 'Low', 'Moderate', 'High'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipeline Runs (System Health)
CREATE TABLE IF NOT EXISTS pipeline_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES sources(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL, -- 'success', 'failure', 'running'
    events_fetched INTEGER DEFAULT 0,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Data: WHO Source
INSERT INTO sources (name, url, tier, type)
VALUES ('WHO Disease Outbreak News', 'https://www.who.int/feeds/newsroom/don/en/rss.xml', 1, 'RSS')
ON CONFLICT (url) DO NOTHING;