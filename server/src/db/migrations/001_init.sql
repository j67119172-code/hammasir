CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(11) UNIQUE NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,

  name VARCHAR(60) NOT NULL,
  gender VARCHAR(6) NOT NULL CHECK (gender IN ('male','female')),
  age SMALLINT NOT NULL CHECK (age BETWEEN 18 AND 80),
  photo_url TEXT,
  profile_notes TEXT,

  same_gender_only BOOLEAN DEFAULT FALSE,
  same_car_class_only BOOLEAN DEFAULT FALSE,
  grouping_paused BOOLEAN DEFAULT FALSE,

  review_status VARCHAR(20) DEFAULT 'pending',
  review_message TEXT,
  profile_changed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_routes (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  origin_province VARCHAR(60),
  origin_city VARCHAR(60),
  origin_region VARCHAR(30),
  origin_area VARCHAR(60),
  origin_point TEXT,
  origin_map_x NUMERIC(5,2),
  origin_map_y NUMERIC(5,2),
  origin_lat NUMERIC(9,6),
  origin_lng NUMERIC(9,6),

  destination_province VARCHAR(60),
  destination_city VARCHAR(60),
  destination_region VARCHAR(30),
  destination_area VARCHAR(60),
  destination_point TEXT,
  destination_map_x NUMERIC(5,2),
  destination_map_y NUMERIC(5,2),
  destination_lat NUMERIC(9,6),
  destination_lng NUMERIC(9,6),

  depart_period VARCHAR(10) CHECK (depart_period IN ('morning','afternoon')),
  depart_start TIME,
  depart_end TIME,
  return_period VARCHAR(10) CHECK (return_period IN ('morning','afternoon')),
  return_start TIME,
  return_end TIME,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_cars (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  car_model VARCHAR(50),
  car_class VARCHAR(10),
  plate_iran VARCHAR(2),
  plate_body VARCHAR(10),
  plate_parity VARCHAR(4),
  seats SMALLINT CHECK (seats BETWEEN 1 AND 3),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_bank_accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  bank_card VARCHAR(16),
  iban VARCHAR(26),
  verified_at TIMESTAMPTZ,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE otp_requests (
  id BIGSERIAL PRIMARY KEY,
  phone VARCHAR(11) NOT NULL,
  code_hash TEXT NOT NULL,
  purpose VARCHAR(20) DEFAULT 'signup',
  attempts SMALLINT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE groups (
  id BIGSERIAL PRIMARY KEY,
  group_mode VARCHAR(20) NOT NULL,
  status VARCHAR(30) NOT NULL,
  creator_id BIGINT REFERENCES users(id),
  target_size SMALLINT,
  origin_city VARCHAR(60),
  is_traffic_city BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  activated_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE TABLE group_members (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id),
  role VARCHAR(10) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  left_at TIMESTAMPTZ,
  removal_reason VARCHAR(30),
  UNIQUE (group_id, user_id)
);

CREATE TABLE proposals (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
  initiator_id BIGINT REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'open',
  started_at TIMESTAMPTZ DEFAULT now(),
  deadline_at TIMESTAMPTZ NOT NULL,
  finalized_at TIMESTAMPTZ,
  result VARCHAR(30)
);

CREATE TABLE proposal_members (
  id BIGSERIAL PRIMARY KEY,
  proposal_id BIGINT REFERENCES proposals(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id),
  response VARCHAR(10) DEFAULT 'pending',
  responded_at TIMESTAMPTZ,
  is_initiator BOOLEAN DEFAULT FALSE,
  UNIQUE (proposal_id, user_id)
);

CREATE TABLE removal_votes (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
  target_user_id BIGINT REFERENCES users(id),
  started_by BIGINT REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'open',
  started_at TIMESTAMPTZ DEFAULT now(),
  closed_at TIMESTAMPTZ
);

CREATE TABLE removal_vote_ballots (
  id BIGSERIAL PRIMARY KEY,
  vote_id BIGINT REFERENCES removal_votes(id) ON DELETE CASCADE,
  voter_id BIGINT REFERENCES users(id),
  choice VARCHAR(10) NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (vote_id, voter_id)
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(id) ON DELETE CASCADE,
  sender_id BIGINT REFERENCES users(id),
  sender_label VARCHAR(60),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_blocks (
  id BIGSERIAL PRIMARY KEY,
  blocker_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  blocked_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  scope VARCHAR(20) DEFAULT 'group',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (blocker_id, blocked_id, scope)
);

CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id BIGINT REFERENCES users(id),
  target_user_id BIGINT REFERENCES users(id),
  group_id BIGINT REFERENCES groups(id),
  category VARCHAR(40),
  text TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  amount INTEGER NOT NULL,
  purpose VARCHAR(30) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  authority VARCHAR(100),
  ref_id VARCHAR(100),
  gateway VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ
);

CREATE TABLE sms_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  phone VARCHAR(11),
  text TEXT,
  purpose VARCHAR(30),
  status VARCHAR(20),
  provider_ref VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE event_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  group_id BIGINT,
  event_type VARCHAR(50),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
