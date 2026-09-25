-- TwinOps Enterprise Digital Twin - Initial Seed Data (Real PostgreSQL Database)
-- Clone: Sm Ali (Mohammad Ali)

INSERT INTO clones (
  id,
  name,
  avatar_url,
  personality,
  expertise_tags,
  status,
  owner_name,
  owner_email,
  owner_role,
  owner_department,
  created_at,
  trained_at
) VALUES (
  'c1000000-0000-0000-0000-000000000001',
  'Sm Ali (Mohammad Ali)',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=face',
  '{"tone": "Direct, visionary, highly technical, and concise.", "bio": "Lead AI Architect architecting autonomous agent workflows, neural grounding, and real-time enterprise digital twins.", "expertise_areas": ["Lead AI Architect", "Enterprise AI Architecture", "Autonomous Agent Systems"]}'::jsonb,
  ARRAY['AI Architecture', 'Next.js', 'PostgreSQL', 'pgvector', 'Agent Systems', 'LangChain', 'TypeScript', 'Multi-Agent Workflows'],
  'active',
  'Sm Ali (Mohammad Ali)',
  'syedmohammadali@example.com',
  'Lead AI Architect',
  'AI Engineering & Architecture',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  personality = EXCLUDED.personality,
  expertise_tags = EXCLUDED.expertise_tags,
  owner_role = EXCLUDED.owner_role,
  owner_department = EXCLUDED.owner_department;

-- Real Integrations
INSERT INTO integrations (id, provider, config, created_at, updated_at)
VALUES 
  ('a1000000-0000-0000-0000-000000000001', 'github', '{"token": "ghp_PLACEHOLDER_GITHUB_TOKEN", "username": "mohammadali-2000", "connected": true}'::jsonb, NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000002', 'teams', '{"webhook_url": "https://accenture.webhook.office.com/webhookb2/0000-sample-webhook-active", "channel": "hls-backend-delivery", "connected": true}'::jsonb, NOW(), NOW())

ON CONFLICT (provider) DO UPDATE SET
  config = EXCLUDED.config,
  updated_at = NOW();

-- Real Memories for Sm Ali (Documents, Chunks, and Facts)
INSERT INTO memories (
  clone_id,
  type,
  source,
  content,
  confidence,
  metadata,
  occurred_at,
  created_at
) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'document',
    'github',
    '# TwinOps Architecture Specification v3.0\nTwinOps operates as an autonomous enterprise digital twin system built on Supabase PostgreSQL (pgvector), Next.js App Router, OpenRouter LLMs, and multi-tenant connector bridges for Microsoft Teams and GitHub.',
    0.95,
    '{"title": "TwinOps Architecture Specification v3.0", "doc_type": "architecture", "repo": "mohammadali-2000/TwinOps"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000001',
    'chunk',
    'github',
    'The core data layer uses PostgreSQL 17 with the pgvector extension for sub-50ms cosine similarity searches across enterprise episodic memories and technical documentation.',
    0.98,
    '{"title": "Database & Vector Retrieval Layer", "source": "github", "doc_type": "technical_spec"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000001',
    'fact',
    'teams',
    'All backend APIs communicate directly with PostgreSQL tables (clones, memories, messages, integrations) without intermediate mock JSON files.',
    0.99,
    '{"channel_name": "hls-backend-delivery", "sender_name": "Sm Ali", "title": "Zero-Mock Database Architecture"}'::jsonb,
    NOW(),
    NOW()
  ),
  (
    'c1000000-0000-0000-0000-000000000001',
    'fact',
    'github',
    'GitHub repository ingestion extracts AST code definitions, PR discussions, and commit metadata directly into the pgvector memories table for real-time RAG context.',
    0.92,
    '{"channel_name": "architecture-governance", "sender_name": "Sm Ali", "title": "GitHub Ingestion Engine"}'::jsonb,
    NOW(),
    NOW()
  );
