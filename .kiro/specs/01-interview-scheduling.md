# 📅 Feature 1: Interview Scheduling System

**Status:** 📝 SPEC READY  
**Priority:** HIGH  
**Estimated Effort:** 3-4 days  
**Dependencies:** None

---

## 🎯 Overview

Build a complete interview scheduling system that automates the entire interview coordination process, from availability checking to calendar invites and reminders.

### Problem Statement
Recruiters spend 30-40% of their time on interview scheduling:
- Back-and-forth emails to find availability
- Manual calendar management
- Missed interviews due to poor communication
- No centralized interview tracking

### Solution
Automated scheduling system with:
- Calendar integration
- Smart availability detection
- One-click interview booking
- Automated notifications
- Interview feedback collection

---

## 📋 Requirements

### Functional Requirements

#### 1. Calendar Integration
- Connect Google Calendar and Outlook
- OAuth 2.0 authentication
- Read/write calendar events
- Sync availability in real-time
- Handle multiple calendars per user

#### 2. Interview Scheduling
- Schedule interviews for candidates
- Select interviewers from team
- Choose interview type (phone, video, onsite)
- Set duration (30min, 1hr, 2hr)
- Add meeting location/link
- Attach job description and resume

#### 3. Availability Management
- View recruiter availability
- View interviewer availability
- Detect scheduling conflicts
- Suggest optimal time slots
- Support multiple time zones

#### 4. Automated Invitations
- Send calendar invites to all participants
- Include meeting details (link, location, agenda)
- Attach candidate resume
- Add preparation notes
- Send confirmation emails

#### 5. Interview Tracking
- List all scheduled interviews
- Filter by status (upcoming, completed, cancelled)
- View interview details
- Reschedule or cancel interviews
- Track interview outcomes

#### 6. Feedback Collection
- Post-interview feedback forms
- Rating system (1-5 stars)
- Structured questions
- Free-form notes
- Hiring recommendation (Yes/No/Maybe)

#### 7. Notifications
- Interview confirmation
- 24-hour reminder
- 1-hour reminder
- Reschedule notifications
- Cancellation alerts

### Non-Functional Requirements
- Calendar sync within 5 seconds
- Support 100+ concurrent interviews
- 99.9% notification delivery
- Mobile-responsive UI
- GDPR compliant

---

## 🎨 Design

### User Flow

```
Recruiter Dashboard
    ↓
Candidate Detail Page
    ↓
Click "Schedule Interview"
    ↓
Interview Scheduling Modal
    ↓
1. Select Interview Type
2. Choose Interviewers
3. Pick Date & Time
4. Add Meeting Details
    ↓
System Checks Availability
    ↓
Confirm & Send Invites
    ↓
Calendar Events Created
    ↓
Emails Sent to All Participants
    ↓
Interview Appears in Schedule
    ↓
[Day of Interview]
    ↓
Reminders Sent
    ↓
[After Interview]
    ↓
Feedback Form Sent
    ↓
Feedback Collected & Stored
```

### Database Schema

```javascript
// New Collections

interviews: {
  _id: ObjectId,
  candidate_id: ObjectId,
  job_id: ObjectId,
  recruiter_id: ObjectId,
  interviewers: [ObjectId], // Array of user IDs
  
  // Interview Details
  type: "phone" | "video" | "onsite" | "technical",
  status: "scheduled" | "completed" | "cancelled" | "rescheduled",
  scheduled_at: datetime,
  duration_minutes: number,
  timezone: string,
  
  // Meeting Details
  meeting_link: string, // Zoom, Google Meet, etc.
  meeting_location: string, // For onsite
  meeting_notes: string,
  
  // Calendar Integration
  calendar_event_id: string,
  calendar_provider: "google" | "outlook",
  
  // Tracking
  created_at: datetime,
  updated_at: datetime,
  cancelled_at: datetime,
  cancellation_reason: string
}

interview_feedback: {
  _id: ObjectId,
  interview_id: ObjectId,
  interviewer_id: ObjectId,
  candidate_id: ObjectId,
  
  // Ratings
  overall_rating: number, // 1-5
  technical_skills: number,
  communication: number,
  culture_fit: number,
  problem_solving: number,
  
  // Feedback
  strengths: string,
  weaknesses: string,
  notes: string,
  
  // Decision
  recommendation: "strong_yes" | "yes" | "maybe" | "no" | "strong_no",
  
  // Metadata
  submitted_at: datetime,
  created_at: datetime
}

calendar_connections: {
  _id: ObjectId,
  user_id: ObjectId,
  provider: "google" | "outlook",
  
  // OAuth Tokens
  access_token: string,
  refresh_token: string,
  token_expires_at: datetime,
  
  // Calendar Info
  calendar_id: string,
  calendar_email: string,
  
  // Status
  is_active: boolean,
  last_synced_at: datetime,
  created_at: datetime
}

// Update existing collections

users: {
  // ... existing fields
  
  // New fields
  calendar_connected: boolean,
  calendar_provider: string,
  timezone: string,
  availability_preferences: {
    monday: [{ start: "09:00", end: "17:00" }],
    tuesday: [{ start: "09:00", end: "17:00" }],
    // ... other days
  }
}

analyses: {
  // ... existing fields
  
  // New fields
  interview_scheduled: boolean,
  interview_id: ObjectId,
  interview_status: string,
  interview_feedback_count: number
}
```

### API Endpoints

#### Calendar Integration
```
POST /api/calendar/connect
Body: { provider: "google" | "outlook", code: string }
Response: { success: boolean, calendar_email: string }

GET /api/calendar/status
Response: { connected: boolean, provider: string, email: string }

DELETE /api/calendar/disconnect
Response: { success: boolean }

GET /api/calendar/availability
Params: { user_id: string, date: string }
Response: { available_slots: [{ start: string, end: string }] }
```

#### Interview Scheduling
```
POST /api/interview/schedule
Body: {
  candidate_id: string,
  job_id: string,
  interviewers: string[],
  type: string,
  scheduled_at: datetime,
  duration_minutes: number,
  meeting_link: string,
  meeting_location: string,
  notes: string
}
Response: { interview_id: string, calendar_event_id: string }

GET /api/interview/list
Params: { status: string, date_from: string, date_to: string }
Response: { interviews: [...] }

GET /api/interview/{id}
Response: { interview: {...}, candidate: {...}, job: {...} }

PUT /api/interview/{id}/reschedule
Body: { scheduled_at: datetime, reason: string }
Response: { success: boolean }

DELETE /api/interview/{id}/cancel
Body: { reason: string }
Response: { success: boolean }
```

#### Feedback
```
POST /api/interview/{id}/feedback
Body: {
  overall_rating: number,
  technical_skills: number,
  communication: number,
  culture_fit: number,
  problem_solving: number,
  strengths: string,
  weaknesses: string,
  notes: string,
  recommendation: string
}
Response: { feedback_id: string }

GET /api/interview/{id}/feedback
Response: { feedback: [...] }
```

#### Notifications
```
POST /api/interview/{id}/send-reminder
Response: { success: boolean, sent_count: number }
```

### Frontend Components

#### New Pages
```
/recruiter/interviews
  - List all interviews
  - Filter by status, date
  - Calendar view option

/recruiter/interviews/{id}
  - Interview details
  - Participant list
  - Feedback summary
  - Reschedule/cancel actions

/recruiter/calendar
  - Calendar view of all interviews
  - Availability overview
  - Quick scheduling

/settings/calendar
  - Connect calendar
  - Set availability preferences
  - Manage integrations
```

#### New Components
```typescript
// ScheduleInterviewModal.tsx
- Modal for scheduling interviews
- Date/time picker
- Interviewer selector
- Meeting details form

// InterviewCard.tsx
- Display interview info
- Status badge
- Quick actions (reschedule, cancel)

// CalendarView.tsx
- Monthly/weekly calendar
- Interview events
- Availability indicators

// FeedbackForm.tsx
- Rating inputs
- Text areas for feedback
- Recommendation selector

// AvailabilityPicker.tsx
- Time slot selector
- Conflict detection
- Timezone support

// InterviewTimeline.tsx
- Visual timeline of interview process
- Status indicators
- Feedback collection status
```

### UI Mockups

#### Schedule Interview Modal
```
┌─────────────────────────────────────────┐
│  📅 Schedule Interview                  │
├─────────────────────────────────────────┤
│                                         │
│  Candidate: John Doe                    │
│  Job: Senior Backend Engineer           │
│                                         │
│  Interview Type                         │
│  ○ Phone  ○ Video  ● Onsite  ○ Tech    │
│                                         │
│  Select Interviewers                    │
│  [x] Alice (Engineering Manager)        │
│  [x] Bob (Senior Engineer)              │
│  [ ] Carol (Tech Lead)                  │
│                                         │
│  Date & Time                            │
│  📅 April 20, 2026  🕐 2:00 PM         │
│  Duration: [1 hour ▼]                   │
│                                         │
│  Meeting Details                        │
│  Link: [https://zoom.us/j/123...]      │
│  Location: [Conference Room A]          │
│                                         │
│  Notes (optional)                       │
│  [Please review the candidate's...]     │
│                                         │
│  ✓ Send calendar invites                │
│  ✓ Send confirmation emails             │
│                                         │
│  [Cancel]  [Check Availability]  [Schedule] │
└─────────────────────────────────────────┘
```

#### Interview List Page
```
┌─────────────────────────────────────────────────────┐
│  📅 Interviews                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [All ▼] [This Week ▼] [🔍 Search...]             │
│                                                     │
│  Upcoming (3)                                       │
│  ┌───────────────────────────────────────────┐    │
│  │ 🟢 Today, 2:00 PM                          │    │
│  │ John Doe - Senior Backend Engineer         │    │
│  │ Video Interview (1 hour)                   │    │
│  │ With: Alice, Bob                           │    │
│  │ [View Details] [Reschedule] [Cancel]       │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │ 🟡 Tomorrow, 10:00 AM                      │    │
│  │ Jane Smith - Frontend Developer            │    │
│  │ Phone Interview (30 min)                   │    │
│  │ With: Carol                                │    │
│  │ [View Details] [Reschedule] [Cancel]       │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
│  Completed (5)                                      │
│  [Show completed interviews...]                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Feedback Form
```
┌─────────────────────────────────────────┐
│  📝 Interview Feedback                  │
├─────────────────────────────────────────┤
│                                         │
│  Candidate: John Doe                    │
│  Position: Senior Backend Engineer      │
│  Date: April 20, 2026                   │
│                                         │
│  Overall Rating                         │
│  ⭐⭐⭐⭐⭐                              │
│                                         │
│  Technical Skills                       │
│  ⭐⭐⭐⭐☆                              │
│                                         │
│  Communication                          │
│  ⭐⭐⭐⭐⭐                              │
│                                         │
│  Culture Fit                            │
│  ⭐⭐⭐⭐☆                              │
│                                         │
│  Problem Solving                        │
│  ⭐⭐⭐⭐⭐                              │
│                                         │
│  Strengths                              │
│  [Strong technical background...]       │
│                                         │
│  Areas for Improvement                  │
│  [Could improve system design...]       │
│                                         │
│  Additional Notes                       │
│  [Great candidate overall...]           │
│                                         │
│  Recommendation                         │
│  ○ Strong Yes  ● Yes  ○ Maybe          │
│  ○ No  ○ Strong No                     │
│                                         │
│  [Cancel]  [Submit Feedback]            │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation Tasks

### Phase 1: Backend Foundation (Day 1)

#### Task 1.1: Database Models
- [ ] Create `interviews` collection schema
- [ ] Create `interview_feedback` collection schema
- [ ] Create `calendar_connections` collection schema
- [ ] Add indexes for performance
- [ ] Update `users` schema with calendar fields
- [ ] Update `analyses` schema with interview fields

#### Task 1.2: Calendar Integration Service
- [ ] Create `calendar_service.py`
- [ ] Implement Google Calendar OAuth flow
- [ ] Implement Outlook Calendar OAuth flow
- [ ] Create calendar event CRUD operations
- [ ] Implement availability checking
- [ ] Add token refresh logic

#### Task 1.3: Interview API Routes
- [ ] Create `/api/interview/schedule` endpoint
- [ ] Create `/api/interview/list` endpoint
- [ ] Create `/api/interview/{id}` endpoint
- [ ] Create `/api/interview/{id}/reschedule` endpoint
- [ ] Create `/api/interview/{id}/cancel` endpoint
- [ ] Add proper error handling

### Phase 2: Calendar Integration (Day 2)

#### Task 2.1: OAuth Implementation
- [ ] Set up Google OAuth credentials
- [ ] Set up Microsoft OAuth credentials
- [ ] Create OAuth callback handlers
- [ ] Implement token storage
- [ ] Add token refresh mechanism

#### Task 2.2: Calendar Sync
- [ ] Implement event creation in Google Calendar
- [ ] Implement event creation in Outlook
- [ ] Add event update functionality
- [ ] Add event deletion functionality
- [ ] Test calendar sync

#### Task 2.3: Availability Detection
- [ ] Fetch user calendar events
- [ ] Calculate free time slots
- [ ] Handle multiple calendars
- [ ] Support timezone conversion
- [ ] Detect scheduling conflicts

### Phase 3: Frontend UI (Day 3)

#### Task 3.1: Interview Scheduling
- [ ] Create `ScheduleInterviewModal` component
- [ ] Add date/time picker
- [ ] Create interviewer selector
- [ ] Add meeting details form
- [ ] Implement availability checking
- [ ] Add form validation

#### Task 3.2: Interview Management
- [ ] Create `/recruiter/interviews` page
- [ ] Build `InterviewCard` component
- [ ] Add filter and search
- [ ] Create interview detail page
- [ ] Add reschedule functionality
- [ ] Add cancel functionality

#### Task 3.3: Calendar Settings
- [ ] Create `/settings/calendar` page
- [ ] Add calendar connection UI
- [ ] Build availability preferences form
- [ ] Show connection status
- [ ] Add disconnect option

### Phase 4: Feedback System (Day 3)

#### Task 4.1: Feedback API
- [ ] Create `/api/interview/{id}/feedback` endpoint
- [ ] Create `/api/interview/{id}/feedback` GET endpoint
- [ ] Add feedback validation
- [ ] Calculate aggregate ratings

#### Task 4.2: Feedback UI
- [ ] Create `FeedbackForm` component
- [ ] Add star rating inputs
- [ ] Create text areas for feedback
- [ ] Add recommendation selector
- [ ] Show feedback summary on interview detail

### Phase 5: Notifications (Day 4)

#### Task 5.1: Email Templates
- [ ] Create interview confirmation template
- [ ] Create reminder email template
- [ ] Create reschedule notification template
- [ ] Create cancellation template
- [ ] Create feedback request template

#### Task 5.2: Notification Service
- [ ] Create `notification_service.py`
- [ ] Implement email sending
- [ ] Add scheduled reminders (24hr, 1hr)
- [ ] Create notification queue
- [ ] Add retry logic

#### Task 5.3: In-App Notifications
- [ ] Create notifications UI component
- [ ] Add notification badge
- [ ] Show upcoming interviews
- [ ] Add notification preferences

### Phase 6: Testing & Polish (Day 4)

#### Task 6.1: Testing
- [ ] Test calendar OAuth flow
- [ ] Test interview scheduling
- [ ] Test availability detection
- [ ] Test notifications
- [ ] Test feedback submission
- [ ] Test edge cases (conflicts, cancellations)

#### Task 6.2: UI Polish
- [ ] Add loading states
- [ ] Add error messages
- [ ] Add success confirmations
- [ ] Add empty states
- [ ] Ensure mobile responsiveness
- [ ] Add animations

#### Task 6.3: Documentation
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Add inline help text
- [ ] Document calendar setup process

---

## 🧪 Testing Checklist

### Calendar Integration
- [ ] Connect Google Calendar successfully
- [ ] Connect Outlook Calendar successfully
- [ ] Token refresh works automatically
- [ ] Disconnect calendar works
- [ ] Multiple calendars supported

### Interview Scheduling
- [ ] Schedule interview creates calendar event
- [ ] All participants receive invites
- [ ] Availability checking works
- [ ] Conflicts are detected
- [ ] Timezone conversion is correct

### Interview Management
- [ ] List all interviews correctly
- [ ] Filter by status works
- [ ] Reschedule updates calendar
- [ ] Cancel removes calendar event
- [ ] Interview details display correctly

### Feedback
- [ ] Submit feedback successfully
- [ ] View all feedback for interview
- [ ] Aggregate ratings calculated
- [ ] Feedback appears on candidate profile

### Notifications
- [ ] Confirmation emails sent
- [ ] 24-hour reminders sent
- [ ] 1-hour reminders sent
- [ ] Reschedule notifications sent
- [ ] Cancellation alerts sent

---

## 🚀 Deployment

### Environment Variables
```bash
# Google Calendar
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/calendar/google/callback

# Microsoft Calendar
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_REDIRECT_URI=http://localhost:8000/api/calendar/microsoft/callback

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Dependencies
```python
# Backend (requirements.txt)
google-auth==2.23.0
google-auth-oauthlib==1.1.0
google-auth-httplib2==0.1.1
google-api-python-client==2.100.0
msal==1.24.0  # Microsoft Authentication Library
```

```json
// Frontend (package.json)
{
  "react-big-calendar": "^1.8.5",
  "date-fns": "^2.30.0",
  "react-datepicker": "^4.21.0"
}
```

---

## 📊 Success Metrics

### Quantitative
- 80% reduction in scheduling time
- 95% interview attendance rate
- 90% feedback submission rate
- <5 second calendar sync time
- 99% notification delivery

### Qualitative
- Recruiters find scheduling "effortless"
- Candidates appreciate automated communication
- Interviewers submit feedback promptly
- No missed interviews due to poor coordination

---

## 🔮 Future Enhancements

### V2 Features
- AI-powered optimal time suggestions
- Group interview scheduling
- Interview recording integration
- Automated interview notes (transcription)
- Interview analytics dashboard
- Candidate self-scheduling portal

### Integrations
- Zoom API for automatic meeting creation
- Microsoft Teams integration
- Slack notifications
- SMS reminders via Twilio

---

## ✅ Definition of Done

- [ ] All API endpoints implemented and tested
- [ ] Calendar integration working for Google and Outlook
- [ ] Interview scheduling UI complete
- [ ] Feedback system functional
- [ ] Notifications sending correctly
- [ ] Mobile responsive
- [ ] Error handling comprehensive
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Deployed to production

---

**Ready to implement!** 🚀

Start with Phase 1: Backend Foundation
