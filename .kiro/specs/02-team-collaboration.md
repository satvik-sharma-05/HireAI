# 👥 Feature 2: Team Collaboration

**Status:** 📋 PLANNED  
**Priority:** HIGH  
**Estimated Effort:** 4-5 days  
**Dependencies:** Feature 1 (Interview Scheduling)

---

## 🎯 Overview

Enable multiple recruiters to work together in shared workspaces with real-time collaboration, comments, mentions, and activity tracking.

### Problem Statement
- Solo recruiter workflows don't scale to teams
- No visibility into what teammates are doing
- Duplicate work and miscommunication
- No way to share candidate insights

### Solution
Multi-recruiter workspace with:
- Shared candidate pools
- Real-time comments and mentions
- Activity feed
- Role-based permissions
- Team analytics

---

## 📋 Requirements

### Functional Requirements

#### 1. Workspace Management
- Create workspaces (company/team level)
- Invite team members via email
- Accept/decline invitations
- Leave workspace
- Archive workspace

#### 2. Role-Based Access Control
- **Admin**: Full access, manage members, billing
- **Recruiter**: Create jobs, schedule interviews, view all candidates
- **Interviewer**: View assigned candidates, submit feedback
- **Viewer**: Read-only access to analytics

#### 3. Shared Candidate Pool
- All candidates visible to workspace members
- Assign candidates to specific recruiters
- Transfer candidate ownership
- Bulk operations (assign, tag, archive)

#### 4. Comments & Mentions
- Comment on candidate profiles
- @mention team members
- Reply to comments (threaded)
- Edit/delete own comments
- Markdown support in comments

#### 5. Activity Feed
- Real-time updates on candidate actions
- Filter by user, action type, date
- "Who did what when" visibility
- Export activity log

#### 6. Notifications
- @mention notifications
- Candidate assignment alerts
- Interview scheduled notifications
- Feedback submitted alerts
- Configurable notification preferences

#### 7. Team Analytics
- Recruiter performance metrics
- Interview-to-hire ratio per recruiter
- Average time-to-hire by team member
- Workload distribution

---

## 🎨 Design

### Database Schema

```javascript
workspaces: {
  _id: ObjectId,
  name: string,
  company_name: string,
  created_by: ObjectId,
  
  // Settings
  settings: {
    allow_external_sharing: boolean,
    require_approval_for_offers: boolean,
    default_candidate_visibility: "all" | "assigned_only"
  },
  
  // Metadata
  created_at: datetime,
  updated_at: datetime,
  is_active: boolean
}

workspace_members: {
  _id: ObjectId,
  workspace_id: ObjectId,
  user_id: ObjectId,
  role: "admin" | "recruiter" | "interviewer" | "viewer",
  
  // Status
  status: "active" | "invited" | "inactive",
  invited_by: ObjectId,
  invited_at: datetime,
  joined_at: datetime,
  
  // Permissions
  permissions: {
    can_create_jobs: boolean,
    can_schedule_interviews: boolean,
    can_view_all_candidates: boolean,
    can_export_data: boolean
  }
}

comments: {
  _id: ObjectId,
  workspace_id: ObjectId,
  entity_type: "candidate" | "job" | "interview",
  entity_id: ObjectId,
  
  // Comment
  user_id: ObjectId,
  content: string,
  mentions: [ObjectId], // Mentioned user IDs
  
  // Threading
  parent_comment_id: ObjectId, // null for top-level
  
  // Metadata
  created_at: datetime,
  updated_at: datetime,
  is_edited: boolean,
  is_deleted: boolean
}

activity_log: {
  _id: ObjectId,
  workspace_id: ObjectId,
  user_id: ObjectId,
  
  // Action
  action_type: "candidate_added" | "interview_scheduled" | "feedback_submitted" | "comment_added" | "candidate_assigned",
  entity_type: "candidate" | "job" | "interview",
  entity_id: ObjectId,
  
  // Details
  details: object, // Action-specific data
  
  // Metadata
  created_at: datetime
}

notifications: {
  _id: ObjectId,
  user_id: ObjectId,
  workspace_id: ObjectId,
  
  // Notification
  type: "mention" | "assignment" | "interview" | "feedback",
  title: string,
  message: string,
  link: string,
  
  // Status
  is_read: boolean,
  read_at: datetime,
  created_at: datetime
}

// Update existing collections
users: {
  // ... existing fields
  current_workspace_id: ObjectId,
  notification_preferences: {
    email_mentions: boolean,
    email_assignments: boolean,
    in_app_notifications: boolean
  }
}

jobs: {
  // ... existing fields
  workspace_id: ObjectId,
  assigned_recruiters: [ObjectId]
}

analyses: {
  // ... existing fields
  workspace_id: ObjectId,
  assigned_to: ObjectId,
  tags: [string]
}
```

### API Endpoints

```
# Workspace Management
POST /api/workspace/create
GET /api/workspace/list
GET /api/workspace/{id}
PUT /api/workspace/{id}
DELETE /api/workspace/{id}

# Members
POST /api/workspace/{id}/invite
GET /api/workspace/{id}/members
PUT /api/workspace/{id}/member/{user_id}/role
DELETE /api/workspace/{id}/member/{user_id}
POST /api/workspace/{id}/join

# Comments
POST /api/comment/create
GET /api/comment/list?entity_type=candidate&entity_id=123
PUT /api/comment/{id}
DELETE /api/comment/{id}

# Activity
GET /api/activity/feed?workspace_id=123
GET /api/activity/export

# Notifications
GET /api/notification/list
PUT /api/notification/{id}/read
PUT /api/notification/read-all
GET /api/notification/unread-count
```

### UI Components

```
/recruiter/workspace/settings
  - Workspace info
  - Member management
  - Invite users
  - Role assignment

/recruiter/team
  - Team member list
  - Performance metrics
  - Activity overview

/recruiter/activity
  - Activity feed
  - Filters
  - Export options

Sidebar:
  - Workspace switcher
  - Notification bell with badge
  - Team member avatars

Candidate Detail:
  - Comments section
  - @mention autocomplete
  - Activity timeline
```

---

## 🔧 Implementation Tasks

### Phase 1: Workspace Foundation (Day 1-2)
- [ ] Create workspace database models
- [ ] Implement workspace CRUD APIs
- [ ] Build workspace creation UI
- [ ] Add workspace switcher
- [ ] Implement member invitation system

### Phase 2: Permissions & Roles (Day 2-3)
- [ ] Implement RBAC middleware
- [ ] Add role-based UI rendering
- [ ] Create member management UI
- [ ] Add permission checks to all APIs

### Phase 3: Comments & Mentions (Day 3-4)
- [ ] Build comments system
- [ ] Add @mention functionality
- [ ] Create comment UI components
- [ ] Implement real-time updates (WebSocket)

### Phase 4: Activity & Notifications (Day 4-5)
- [ ] Create activity logging service
- [ ] Build activity feed UI
- [ ] Implement notification system
- [ ] Add notification preferences

### Phase 5: Team Analytics (Day 5)
- [ ] Calculate team metrics
- [ ] Build analytics dashboard
- [ ] Add export functionality

---

## ✅ Success Metrics

- 5+ recruiters per workspace
- 50+ comments per day
- 95% notification delivery
- <2 second activity feed load time

---

**Status:** Ready for implementation after Feature 1
