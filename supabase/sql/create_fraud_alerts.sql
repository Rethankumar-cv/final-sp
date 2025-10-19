-- Create fraud_alerts table for storing ML alerts
-- Run this in Supabase SQL editor (or via Supabase CLI)

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text,
  payload jsonb,
  prediction text,
  risk_score numeric,
  rules_triggered jsonb,
  reason text,
  llm_explanation text,
  created_at timestamptz DEFAULT now()
);

-- Optional index for faster lookups by transaction_id
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_transaction_id ON public.fraud_alerts (transaction_id);

-- Example insert (uncomment to run as a test)
-- INSERT INTO public.fraud_alerts (transaction_id, payload, prediction, risk_score, rules_triggered, reason, llm_explanation)
-- VALUES ('tx-test-1', '{"transaction_id":"tx-test-1"}'::jsonb, 'Fraud', 0.85, '[{"name":"high_amount","severity":"high"}]'::jsonb, 'Test reason', 'Test explanation');
