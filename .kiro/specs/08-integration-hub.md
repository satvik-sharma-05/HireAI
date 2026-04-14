# 🔌 Feature 8: Integration Hub

**Status:** 📋 PLANNED  
**Priority:** MEDIUM  
**Estimated Effort:** 5 days  
**Dependencies:** None (can be built in parallel)

---

## 🎯 Overview

Comprehensive integration hub connecting HireAI with external platforms: LinkedIn, GitHub, ATS systems, calendars, Zapier, and custom webhooks.

### Problem Statement
- Manual data entry from LinkedIn profiles
- No visibility into candidate's code quality
- Can't sync with existing ATS
- Isolated from other tools in tech stack
- No automation between systems

### Solution
- LinkedIn profile import
- GitHub profile analysis
- ATS integrations (Greenhouse, Lever)
- Calendar sync (Google, Outlook)
- Zapier integration
- Webhook support for custom integrations
- API marketplace

---

## 📋 Requirements

### Integration Types

#### 1. LinkedIn Integration
- OAuth authentication
- Import candidate profile
- Extract work experience
- Extract education
- Extract skills
- Import profile photo
- Sync connections (optional)

#### 2. GitHub Integration
- OAuth authentication
- Fetch public repositories
- Analyze code quality
- Calculate contribution metrics
- Extract tech stack
- Show activity graph
- Link to candidate profile

#### 3. ATS Integrations
**Greenhouse:**
- Sync candidates
- Sync jobs
- Push analysis results
- Webhook notifications

**Lever:**
- Import candidates
- Export feedback
- Sync interview schedules

#### 4. Calendar Sync (Enhanced)
- Google Calendar (already in Feature 1)
- Outlook Calendar (already in Feature 1)
- Apple Calendar
- Sync across all platforms

#### 5. Communication Tools
**Slack:**
- Workspace integration
- Channel notifications
- Slash commands
- Interactive messages

**Microsoft Teams:**
- Team integration
- Channel notifications
- Bot commands

#### 6. Zapier Integration
- Trigger: New candidate added
- Trigger: Interview scheduled
- Trigger: Offer sent
- Action: Create candidate
- Action: Schedule interview

#### 7. Webhooks
- Custom webhook endpoints
- Event subscriptions
- Payload customization
- Retry logic
- Webhook logs

---

## 🎨 Design

### Database Schema

```javascript
integrations: {
  _id: ObjectId,
  workspace_id: ObjectId,
  user_id: ObjectId,
  
  // Integration
  provider: "linkedin" | "github" | "greenhouse" | "lever" | "slack" | "teams" | "zapier",
  name: string,
  
  // Auth
  auth_type: "oauth" | "api_key" | "webhook",
  access_token: string,
  refresh_token: string,
  token_expires_at: datetime,
  api_key: string,
  
  // Configuration
  config: object, // Provider-specific settings
  
  // Status
  is_active: boolean,
  last_synced_at: datetime,
  sync_status: "success" | "failed" | "in_progress",
  error_message: string,
  
  // Metadata
  created_at: datetime,
  updated_at: datetime
}

integration_logs: {
  _id: ObjectId,
  integration_id: ObjectId,
  
  // Event
  event_type: "sync" | "import" | "export" | "webhook",
  direction: "inbound" | "outbound",
  
  // Details
  entity_type: string, // "candidate", "job", "interview"
  entity_id: ObjectId,
  payload: object,
  response: object,
  
  // Status
  status: "success" | "failed",
  error_message: string,
  duration_ms: number,
  
  // Metadata
  created_at: datetime
}

webhooks: {
  _id: ObjectId,
  workspace_id: ObjectId,
  created_by: ObjectId,
  
  // Webhook
  name: string,
  url: string,
  secret: string,
  
  // Events
  events: [string], // ["candidate.created", "interview.scheduled"]
  
  // Configuration
  headers: object,
  payload_template: string,
  retry_count: number,
  timeout_seconds: number,
  
  // Status
  is_active: boolean,
  last_triggered_at: datetime,
  success_count: number,
  failure_count: number,
  
  // Metadata
  created_at: datetime
}

linkedin_profiles: {
  _id: ObjectId,
  candidate_id: ObjectId,
  linkedin_id: string,
  
  // Profile
  profile_url: string,
  headline: string,
  summary: string,
  location: string,
  profile_photo_url: string,
  
  // Experience
  experience: [{
    title: string,
    company: string,
    location: string,
    start_date: date,
    end_date: date,
    description: string
  }],
  
  // Education
  education: [{
    school: string,
    degree: string,
    field: string,
    start_date: date,
    end_date: date
  }],
  
  // Skills
  skills: [string],
  endorsements: object,
  
  // Metadata
  imported_at: datetime,
  last_synced_at: datetime
}

github_profiles: {
  _id: ObjectId,
  candidate_id: ObjectId,
  github_username: string,
  
  // Profile
  profile_url: string,
  bio: string,
  location: string,
  avatar_url: string,
  
  // Stats
  public_repos: number,
  followers: number,
  following: number,
  total_stars: number,
  total_commits: number,
  
  // Repositories
  repositories: [{
    name: string,
    description: string,
    language: string,
    stars: number,
    forks: number,
    url: string,
    last_updated: date
  }],
  
  // Languages
  languages: object, // { "JavaScript": 45, "Python": 30, ... }
  
  // Activity
  contribution_graph: object,
  streak_days: number,
  
  // Analysis
  code_quality_score: number,
  activity_score: number,
  
  // Metadata
  imported_at: datetime,
  last_synced_at: datetime
}
```

### API Endpoints

```
# Integration Management
GET /api/integration/list
POST /api/integration/connect
DELETE /api/integration/{id}/disconnect
POST /api/integration/{id}/sync
GET /api/integration/{id}/status

# LinkedIn
GET /api/integration/linkedin/auth-url
POST /api/integration/linkedin/callback
POST /api/integration/linkedin/import-profile
Params: { profile_url: string }
Response: { candidate_id: ObjectId, profile: {...} }

# GitHub
GET /api/integration/github/auth-url
POST /api/integration/github/callback
POST /api/integration/github/import-profile
Params: { username: string }
Response: { profile: {...}, analysis: {...} }

GET /api/integration/github/analyze
Params: { username: string }
Response: {
  code_quality_score: number,
  top_languages: [...],
  activity_level: string,
  notable_projects: [...]
}

# ATS Integrations
POST /api/integration/greenhouse/sync-candidates
POST /api/integration/greenhouse/push-analysis
POST /api/integration/lever/import-candidates

# Webhooks
GET /api/webhook/list
POST /api/webhook/create
PUT /api/webhook/{id}
DELETE /api/webhook/{id}
POST /api/webhook/{id}/test
GET /api/webhook/{id}/logs

# Zapier
GET /api/zapier/triggers
GET /api/zapier/actions
POST /api/zapier/subscribe
DELETE /api/zapier/unsubscribe

# Logs
GET /api/integration/logs
Params: { integration_id, event_type, status, date_range }
Response: { logs: [...] }
```

### UI Components

```
/settings/integrations
  - Integration marketplace
  - Connected integrations
  - Connection status
  - Sync history

/settings/integrations/linkedin
  - Connect LinkedIn
  - Import settings
  - Auto-sync preferences

/settings/integrations/github
  - Connect GitHub
  - Analysis settings
  - Repository filters

/settings/integrations/webhooks
  - Webhook list
  - Create webhook
  - Test webhook
  - View logs

Components:
- IntegrationCard.tsx
- IntegrationSetup.tsx
- WebhookBuilder.tsx
- IntegrationLogs.tsx
- LinkedInImporter.tsx
- GitHubAnalyzer.tsx
```

### Integration Marketplace

```
┌─────────────────────────────────────────────────────┐
│  🔌 Integration Hub                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [All ▼] [🔍 Search integrations...]               │
│                                                     │
│  Popular Integrations                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ LinkedIn │ │  GitHub  │ │  Slack   │           │
│  │    🔗    │ │    🔗    │ │    ✓     │           │
│  │ Connect  │ │ Connect  │ │Connected │           │
│  └──────────┘ └──────────┘ └──────────┘           │
│                                                     │
│  ATS Platforms                                      │
│  ┌──────────┐ ┌──────────┐                        │
│  │Greenhouse│ │  Lever   │                        │
│  │    🔗    │ │    🔗    │                        │
│  │ Connect  │ │ Connect  │                        │
│  └──────────┘ └──────────┘                        │
│                                                     │
│  Communication                                      │
│  ┌──────────┐ ┌──────────┐                        │
│  │  Teams   │ │  Zapier  │                        │
│  │    🔗    │ │    🔗    │                        │
│  │ Connect  │ │ Connect  │                        │
│  └──────────┘ └──────────┘                        │
│                                                     │
│  Custom Integrations                                │
│  ┌──────────────────────────────────────────┐     │
│  │ 🔗 Webhooks                              │     │
│  │ Create custom integrations with webhooks │     │
│  │ [Configure Webhooks]                     │     │
│  └──────────────────────────────────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### LinkedIn Import Flow

```
┌─────────────────────────────────────────┐
│  🔗 Import from LinkedIn                │
├─────────────────────────────────────────┤
│                                         │
│  Step 1: Connect LinkedIn               │
│  [Connect LinkedIn Account]             │
│                                         │
│  Step 2: Enter Profile URL              │
│  [https://linkedin.com/in/johndoe]     │
│                                         │
│  Step 3: Preview Import                 │
│  ┌───────────────────────────────────┐ │
│  │ John Doe                          │ │
│  │ Senior Software Engineer          │ │
│  │ San Francisco, CA                 │ │
│  │                                   │ │
│  │ Experience:                       │ │
│  │ • Tech Corp (2020-Present)        │ │
│  │ • StartupXYZ (2018-2020)          │ │
│  │                                   │ │
│  │ Skills:                           │ │
│  │ React, Node.js, AWS, Python       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ☑ Import work experience              │
│  ☑ Import education                    │
│  ☑ Import skills                       │
│  ☑ Import profile photo                │
│                                         │
│  [Cancel] [Import Profile]             │
└─────────────────────────────────────────┘
```

### GitHub Analysis

```
┌─────────────────────────────────────────┐
│  💻 GitHub Profile Analysis             │
├─────────────────────────────────────────┤
│                                         │
│  Username: johndoe                      │
│  Profile: github.com/johndoe            │
│                                         │
│  📊 Overview                            │
│  • Public Repos: 42                     │
│  • Total Stars: 1,234                   │
│  • Followers: 567                       │
│  • Contributions: 2,345 (last year)     │
│                                         │
│  🏆 Code Quality Score: 85/100          │
│  ⭕⭕⭕⭕⭕⭕⭕⭕⚪⚪                      │
│                                         │
│  💻 Top Languages                       │
│  JavaScript  ████████████  45%          │
│  Python      ████████      30%          │
│  TypeScript  ████          15%          │
│  Go          ██            10%          │
│                                         │
│  🌟 Notable Projects                    │
│  • awesome-react-app (234 ⭐)          │
│  • ml-toolkit (189 ⭐)                 │
│  • api-framework (156 ⭐)              │
│                                         │
│  📈 Activity Level: High                │
│  Consistent contributor with quality    │
│  code and active maintenance.           │
│                                         │
│  [View Full Profile] [Add to Candidate] │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation Tasks

### Phase 1: LinkedIn Integration (Day 1)
- [ ] Set up LinkedIn OAuth
- [ ] Implement profile import
- [ ] Parse LinkedIn data
- [ ] Create import UI
- [ ] Add profile mapping

### Phase 2: GitHub Integration (Day 2)
- [ ] Set up GitHub OAuth
- [ ] Fetch repository data
- [ ] Calculate code quality metrics
- [ ] Build analysis UI
- [ ] Create GitHub profile card

### Phase 3: ATS Integrations (Day 2-3)
- [ ] Greenhouse API integration
- [ ] Lever API integration
- [ ] Build sync service
- [ ] Add mapping configuration
- [ ] Create sync UI

### Phase 4: Webhooks (Day 3-4)
- [ ] Create webhook system
- [ ] Build webhook UI
- [ ] Implement event triggers
- [ ] Add retry logic
- [ ] Create webhook logs

### Phase 5: Zapier & Polish (Day 4-5)
- [ ] Build Zapier integration
- [ ] Create integration marketplace UI
- [ ] Add integration logs
- [ ] Test all integrations
- [ ] Write documentation

---

## ✅ Success Metrics

- 5+ integrations available
- 80% profile import success rate
- <5 second import time
- 99% webhook delivery rate
- 50% reduction in manual data entry

---

## 🔮 Future Integrations

- Indeed job posting
- Glassdoor reviews
- HackerRank assessments
- Codility challenges
- AngelList profiles
- Twitter/X profiles
- Stack Overflow profiles

---

**Status:** Ready for implementation (can start anytime)
