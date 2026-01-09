-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('anomaly_volume', 'confirmed_outbreak', 'system', 'research_update')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'info')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy: Allow anonymous read (for dashboard)
CREATE POLICY "Allow public read access" ON alerts FOR SELECT USING (true);

-- Policy: Allow service role write (for ingestion scripts)
-- Note: Service role bypasses RLS, but explicit policies can be good documentation.
