CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE ngos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngos(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'dispatcher', 'volunteer', 'donor', 'partner')),
  full_name TEXT NOT NULL,
  auth_provider_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  city TEXT NOT NULL,
  home_location GEOGRAPHY(Point, 4326),
  availability_hours INT NOT NULL DEFAULT 0,
  reliability_score NUMERIC(5,2) NOT NULL DEFAULT 50,
  missions_completed INT NOT NULL DEFAULT 0,
  trust_badge TEXT NOT NULL DEFAULT 'New',
  languages TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  external_verification_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE volunteer_skills (
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_source TEXT,
  certification_url TEXT,
  PRIMARY KEY (volunteer_id, skill_id)
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  ward TEXT,
  address TEXT,
  point GEOGRAPHY(Point, 4326) NOT NULL
);

CREATE TABLE community_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngos(id),
  location_id UUID REFERENCES locations(id),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('OCR', 'CSV', 'Excel', 'WhatsApp', 'Field App', 'Voice')),
  people_affected INT NOT NULL,
  severity INT NOT NULL CHECK (severity BETWEEN 1 AND 10),
  vulnerability INT NOT NULL CHECK (vulnerability BETWEEN 1 AND 10),
  wait_hours INT NOT NULL DEFAULT 0,
  weather_risk INT NOT NULL DEFAULT 0,
  poverty_index INT NOT NULL DEFAULT 0,
  repeated_reports INT NOT NULL DEFAULT 0,
  priority_score INT NOT NULL CHECK (priority_score BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'Open',
  raw_payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES community_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  required_skill_ids UUID[] NOT NULL DEFAULT '{}',
  required_languages TEXT[] NOT NULL DEFAULT '{}',
  urgency INT NOT NULL CHECK (urgency BETWEEN 1 AND 10),
  status TEXT NOT NULL CHECK (status IN ('Open', 'Assigned', 'In Progress', 'Completed')),
  eta_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE,
  match_score INT NOT NULL,
  match_factors JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'Proposed',
  check_in_at TIMESTAMPTZ,
  check_out_at TIMESTAMPTZ,
  proof_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngos(id),
  title TEXT NOT NULL,
  metrics JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_requests_priority ON community_requests(priority_score DESC);
CREATE INDEX idx_requests_status ON community_requests(status);
CREATE INDEX idx_volunteers_location ON volunteers USING GIST(home_location);
CREATE INDEX idx_locations_point ON locations USING GIST(point);
