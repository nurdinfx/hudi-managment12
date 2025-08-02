-- Add payments table to existing Supabase schema

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  reference_number VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  base_amount DECIMAL(10,2) NOT NULL,
  fee_amount DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'expired', 'cancelled')),
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  adults INTEGER NOT NULL,
  children INTEGER NOT NULL,
  number_of_days INTEGER NOT NULL,
  phone_number VARCHAR(20),
  account_number VARCHAR(50),
  transaction_id VARCHAR(255),
  provider_response JSONB,
  notes TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for payments table
CREATE INDEX idx_payments_payment_id ON payments(payment_id);
CREATE INDEX idx_payments_reference ON payments(reference_number);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_room ON payments(room_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(payment_method);
CREATE INDEX idx_payments_expires ON payments(expires_at);

-- Enable RLS for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all payments" ON payments FOR ALL USING (auth.role() = 'service_role');

-- Add trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create function to automatically expire payments
CREATE OR REPLACE FUNCTION expire_old_payments()
RETURNS void AS $$
BEGIN
  UPDATE payments 
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to check payment status
CREATE OR REPLACE FUNCTION get_payment_summary(user_uuid UUID)
RETURNS TABLE (
  total_payments BIGINT,
  pending_payments BIGINT,
  confirmed_payments BIGINT,
  total_amount DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_payments,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_payments,
    COUNT(*) FILTER (WHERE status = 'confirmed')::BIGINT as confirmed_payments,
    COALESCE(SUM(amount) FILTER (WHERE status = 'confirmed'), 0)::DECIMAL(10,2) as total_amount
  FROM payments 
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
