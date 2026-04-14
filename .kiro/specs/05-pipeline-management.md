# 🎯 Feature 5: Candidate Pipeline Management

**Status:** 📋 PLANNED  
**Priority:** HIGH  
**Estimated Effort:** 3-4 days  
**Dependencies:** Feature 2 (Team Collaboration)

---

## 🎯 Overview

Visual Kanban-style pipeline management with drag-and-drop candidate movement, automated stage transitions, and pipeline analytics.

### Problem Statement
- No visual representation of hiring pipeline
- Manual status updates are tedious
- Can't see bottlenecks at a glance
- No automated workflow triggers

### Solution
- Kanban board interface
- Drag-and-drop candidate cards
- Automated stage transitions
- Stage-specific actions
- Pipeline health metrics
- Bottleneck detection

---

## 📋 Requirements

### Functional Requirements

#### 1. Pipeline Stages
**Default Stages:**
- 📥 Applied (New applications)
- 🔍 Screening (Resume review)
- 📞 Phone Screen (Initial call)
- 💻 Technical Interview (Coding/technical)
- 👥 Team Interview (Culture fit)
- 📝 Offer (Offer extended)
- ✅ Hired (Accepted offer)
- ❌ Rejected (Not moving forward)

**Custom Stages:**
- Create custom stages
- Reorder stages
- Archive unused stages
- Set stage colors

#### 2. Kanban Board
- Column per stage
- Candidate cards with key info
- Drag-and-drop between stages
- Card count per column
- Scroll within columns
- Collapse/expand columns

#### 3. Candidate Cards
**Display:**
- Candidate name
- Job title
- Match score (circular)
- Days in current stage
- Assigned recruiter avatar
- Tags/labels
- Priority indicator

**Quick Actions:**
- View full profile
- Schedule interview
- Move to stage
- Add comment
- Assign to recruiter

#### 4. Automated Transitions
**Triggers:**
- Interview scheduled → Move to "Interview" stage
- Feedback submitted → Move to next stage (configurable)
- Offer created → Move to "Offer" stage
- Offer accepted → Move to "Hired" stage

**Rules Engine:**
- If/then conditions
- Multi-step workflows
- Email notifications on transition
- Slack/Teams alerts

#### 5. Filters & Search
- Filter by job
- Filter by recruiter
- Filter by score range
- Filter by date range
- Search by candidate name
- Filter by tags

#### 6. Bulk Operations
- Select multiple candidates
- Bulk move to stage
- Bulk assign recruiter
- Bulk add tags
- Bulk archive

#### 7. Pipeline Analytics
- Candidates per stage
- Average time in each stage
- Conversion rates
- Bottleneck detection
- Stage capacity warnings

---

## 🎨 Design

### Database Schema

```javascript
pipeline_stages: {
  _id: ObjectId,
  workspace_id: ObjectId,
  name: string,
  description: string,
  color: string, // hex color
  order: number,
  
  // Settings
  is_default: boolean,
  is_active: boolean,
  is_terminal: boolean, // "Hired" or "Rejected"
  
  // Automation
  auto_transition_rules: [{
    trigger: string, // "interview_scheduled", "feedback_submitted"
    condition: object,
    next_stage_id: ObjectId
  }],
  
  // Actions
  available_actions: [string], // ["schedule_interview", "send_offer"]
  
  created_at: datetime
}

pipeline_transitions: {
  _id: ObjectId,
  candidate_id: ObjectId,
  from_stage_id: ObjectId,
  to_stage_id: ObjectId,
  
  // Context
  moved_by: ObjectId,
  reason: string,
  is_automated: boolean,
  
  // Metadata
  created_at: datetime
}

candidate_tags: {
  _id: ObjectId,
  workspace_id: ObjectId,
  name: string,
  color: string,
  created_by: ObjectId,
  created_at: datetime
}

// Update existing collections
analyses: {
  // ... existing fields
  current_stage_id: ObjectId,
  stage_entered_at: datetime,
  days_in_stage: number,
  priority: "low" | "medium" | "high",
  tags: [ObjectId]
}
```

### API Endpoints

```
# Stages
GET /api/pipeline/stages
POST /api/pipeline/stage/create
PUT /api/pipeline/stage/{id}
DELETE /api/pipeline/stage/{id}
PUT /api/pipeline/stages/reorder

# Candidates
GET /api/pipeline/candidates
Params: { stage_id, job_id, recruiter_id, tags }
Response: { candidates: [...], counts: {...} }

POST /api/pipeline/candidate/{id}/move
Body: { to_stage_id: ObjectId, reason: string }
Response: { success: boolean }

POST /api/pipeline/candidates/bulk-move
Body: { candidate_ids: [ObjectId], to_stage_id: ObjectId }
Response: { moved_count: number }

# Tags
GET /api/pipeline/tags
POST /api/pipeline/tag/create
PUT /api/pipeline/tag/{id}
DELETE /api/pipeline/tag/{id}

POST /api/pipeline/candidate/{id}/tag
Body: { tag_ids: [ObjectId] }

# Analytics
GET /api/pipeline/analytics
Response: {
  stage_counts: {...},
  avg_time_per_stage: {...},
  conversion_rates: {...},
  bottlenecks: [...]
}

# Automation
POST /api/pipeline/automation/create
GET /api/pipeline/automation/list
PUT /api/pipeline/automation/{id}
DELETE /api/pipeline/automation/{id}
```

### UI Components

```
/recruiter/pipeline
  - Kanban board
  - Stage columns
  - Candidate cards
  - Filters sidebar
  - Analytics panel

Components:
- PipelineBoard.tsx
- StageColumn.tsx
- CandidateCard.tsx
- PipelineFilters.tsx
- StageSettings.tsx
- AutomationBuilder.tsx
```

### Kanban Board Mockup

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎯 Pipeline - Senior Backend Engineer                              │
├─────────────────────────────────────────────────────────────────────┤
│  [All Jobs ▼] [All Recruiters ▼] [🔍 Search] [⚙️ Settings]        │
│                                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ 📥 Applied│ │🔍Screening│ │📞 Phone  │ │💻Technical│ │✅ Offer  ││
│  │   (12)   │ │   (8)    │ │   (5)    │ │   (3)    │ │   (2)    ││
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤│
│  │┌────────┐│ │┌────────┐│ │┌────────┐│ │┌────────┐│ │┌────────┐││
│  ││John Doe││ ││Jane S. ││ ││Bob J.  ││ ││Alice B.││ ││Carol W.│││
│  ││⭕ 92%  ││ ││⭕ 88%  ││ ││⭕ 85%  ││ ││⭕ 90%  ││ ││⭕ 95%  │││
│  ││2 days  ││ ││5 days  ││ ││3 days  ││ ││7 days  ││ ││1 day   │││
│  ││👤 Alice││ ││👤 Bob  ││ ││👤 Alice││ ││👤 Carol││ ││👤 Alice│││
│  ││🏷️ Hot  ││ ││        ││ ││        ││ ││🏷️ Hot  ││ ││        │││
│  │└────────┘│ │└────────┘│ │└────────┘│ │└────────┘│ │└────────┘││
│  │┌────────┐│ │┌────────┐│ │┌────────┐│ │┌────────┐│ │┌────────┐││
│  ││Sarah M.││ ││Tom K.  ││ ││Emma L. ││ ││David P.││ ││Frank T.│││
│  ││⭕ 87%  ││ ││⭕ 82%  ││ ││⭕ 80%  ││ ││⭕ 88%  ││ ││⭕ 92%  │││
│  ││1 day   ││ ││4 days  ││ ││6 days  ││ ││5 days  ││ ││2 days  │││
│  │└────────┘│ │└────────┘│ │└────────┘│ │└────────┘│ │└────────┘││
│  │   ...    │ │   ...    │ │   ...    │ │          │ │          ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘│
│                                                                     │
│  📊 Pipeline Health: ⚠️ Bottleneck detected in "Technical" stage   │
│  Average time: 7.2 days (target: 5 days)                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Tasks

### Phase 1: Stage Management (Day 1)
- [ ] Create pipeline stages model
- [ ] Implement stage CRUD APIs
- [ ] Build stage settings UI
- [ ] Add stage reordering

### Phase 2: Kanban Board (Day 2)
- [ ] Create Kanban board component
- [ ] Build stage columns
- [ ] Create candidate cards
- [ ] Implement drag-and-drop (react-beautiful-dnd)

### Phase 3: Candidate Movement (Day 2-3)
- [ ] Implement move API
- [ ] Add transition logging
- [ ] Build bulk operations
- [ ] Add undo functionality

### Phase 4: Automation (Day 3)
- [ ] Create automation rules engine
- [ ] Build automation UI
- [ ] Implement triggers
- [ ] Add notification integration

### Phase 5: Analytics & Polish (Day 4)
- [ ] Calculate pipeline metrics
- [ ] Build analytics panel
- [ ] Add bottleneck detection
- [ ] Implement filters and search

---

## ✅ Success Metrics

- <1 second drag-and-drop response
- 100+ candidates managed
- 80% reduction in manual status updates
- 50% faster candidate progression

---

**Status:** Ready for implementation after Feature 2
