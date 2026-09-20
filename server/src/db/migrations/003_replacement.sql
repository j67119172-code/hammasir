CREATE TABLE replacement_flows (
  id BIGSERIAL PRIMARY KEY,
  group_id BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  candidate_user_id BIGINT NOT NULL REFERENCES users(id),
  stage VARCHAR(20) NOT NULL DEFAULT 'group_vote',
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  group_deadline_at TIMESTAMPTZ NOT NULL,
  candidate_deadline_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  finalized_at TIMESTAMPTZ,
  result VARCHAR(30)
);

CREATE INDEX idx_replacement_group_open
  ON replacement_flows(group_id) WHERE status = 'open';

CREATE TABLE replacement_votes (
  id BIGSERIAL PRIMARY KEY,
  flow_id BIGINT NOT NULL REFERENCES replacement_flows(id) ON DELETE CASCADE,
  voter_id BIGINT NOT NULL REFERENCES users(id),
  choice VARCHAR(10) NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (flow_id, voter_id)
);

CREATE INDEX idx_replacement_votes_flow ON replacement_votes(flow_id);

CREATE TABLE proposal_rejections (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal_id BIGINT REFERENCES proposals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, target_user_id)
);

CREATE INDEX idx_rejections_user ON proposal_rejections(user_id);

CREATE TABLE city_coords (
  city VARCHAR(60) PRIMARY KEY,
  province VARCHAR(60) NOT NULL,
  lat NUMERIC(9,6) NOT NULL,
  lng NUMERIC(9,6) NOT NULL
);

CREATE INDEX idx_city_coords_province ON city_coords(province);
