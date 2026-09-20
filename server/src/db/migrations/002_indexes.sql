CREATE INDEX idx_routes_user_active ON user_routes(user_id) WHERE is_active;
CREATE INDEX idx_routes_matching
  ON user_routes(origin_city, destination_city, depart_period, return_period)
  WHERE is_active;
CREATE INDEX idx_cars_user_active ON user_cars(user_id) WHERE is_active;
CREATE INDEX idx_otp_phone_active ON otp_requests(phone) WHERE used_at IS NULL;
CREATE INDEX idx_otp_expiry ON otp_requests(expires_at);
CREATE INDEX idx_proposal_members_pending
  ON proposal_members(proposal_id) WHERE response = 'pending';
CREATE INDEX idx_messages_group_time ON messages(group_id, created_at DESC);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_event_log_created ON event_log(created_at DESC);
