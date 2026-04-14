# 📊 Feature 4: Advanced Analytics & Reporting

**Status:** 📋 PLANNED  
**Priority:** MEDIUM  
**Estimated Effort:** 4 days  
**Dependencies:** Feature 1, Feature 2

---

## 🎯 Overview

Comprehensive analytics dashboard with hiring funnel metrics, time-to-hire tracking, source effectiveness, custom reports, and predictive insights.

### Problem Statement
- No visibility into hiring pipeline health
- Can't identify bottlenecks
- No data-driven decision making
- Manual report generation is time-consuming

### Solution
- Real-time analytics dashboard
- Hiring funnel visualization
- Custom report builder
- Automated weekly/monthly reports
- Predictive analytics (AI-powered)
- Export to PDF/Excel

---

## 📋 Requirements

### Analytics Categories

#### 1. Pipeline Metrics
- Total candidates by stage
- Conversion rates between stages
- Drop-off analysis
- Stage duration averages
- Bottleneck identification

#### 2. Time Metrics
- Time-to-hire (application to offer)
- Time-to-interview
- Time-to-feedback
- Stage-specific durations
- Trends over time

#### 3. Source Effectiveness
- Candidates by source (LinkedIn, referral, job board)
- Conversion rate by source
- Quality score by source
- Cost-per-hire by source

#### 4. Recruiter Performance
- Candidates processed per recruiter
- Interview-to-hire ratio
- Average time-to-hire
- Feedback response time
- Candidate satisfaction scores

#### 5. Job Analytics
- Applications per job
- Average match score per job
- Time-to-fill
- Offer acceptance rate
- Salary competitiveness

#### 6. Candidate Quality
- Average match scores over time
- Skills distribution
- Experience level breakdown
- Education background
- Geographic distribution

#### 7. Interview Analytics
- Interviews scheduled vs completed
- No-show rate
- Feedback submission rate
- Average interview ratings
- Interviewer effectiveness

---

## 🎨 Design

### Database Schema

```javascript
analytics_snapshots: {
  _id: ObjectId,
  workspace_id: ObjectId,
  snapshot_date: date,
  
  // Pipeline
  pipeline: {
    applied: number,
    screening: number,
    interview: number,
    offer: number,
    hired: number,
    rejected: number
  },
  
  // Conversion Rates
  conversion_rates: {
    applied_to_screening: number,
    screening_to_interview: number,
    interview_to_offer: number,
    offer_to_hired: number
  },
  
  // Time Metrics
  avg_time_to_hire: number,
  avg_time_to_interview: number,
  avg_time_to_feedback: number,
  
  // Quality
  avg_match_score: number,
  high_quality_candidates: number,
  
  created_at: datetime
}

custom_reports: {
  _id: ObjectId,
  workspace_id: ObjectId,
  created_by: ObjectId,
  
  // Report Config
  name: string,
  description: string,
  report_type: "pipeline" | "time" | "source" | "recruiter" | "custom",
  
  // Filters
  filters: {
    date_range: { start: date, end: date },
    jobs: [ObjectId],
    recruiters: [ObjectId],
    stages: [string],
    sources: [string]
  },
  
  // Metrics
  metrics: [string], // ["time_to_hire", "conversion_rate", etc.]
  
  // Visualization
  chart_type: "line" | "bar" | "pie" | "table",
  
  // Schedule
  is_scheduled: boolean,
  schedule_frequency: "daily" | "weekly" | "monthly",
  schedule_day: number,
  recipients: [string], // Email addresses
  
  // Metadata
  created_at: datetime,
  last_generated_at: datetime
}

candidate_sources: {
  _id: ObjectId,
  name: string,
  type: "job_board" | "referral" | "linkedin" | "company_website" | "other",
  
  // Tracking
  total_candidates: number,
  hired_candidates: number,
  avg_match_score: number,
  avg_time_to_hire: number,
  
  // Cost (optional)
  cost_per_candidate: number,
  total_cost: number
}

// Update existing collections
analyses: {
  // ... existing fields
  source: string,
  source_id: ObjectId,
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected",
  stage_updated_at: datetime,
  stage_history: [{
    stage: string,
    entered_at: datetime,
    exited_at: datetime,
    duration_hours: number
  }]
}
```

### API Endpoints

```
# Dashboard
GET /api/analytics/dashboard
Response: {
  pipeline: {...},
  time_metrics: {...},
  quality_metrics: {...},
  trends: {...}
}

# Pipeline
GET /api/analytics/pipeline
Params: { date_range, jobs, recruiters }
Response: { stages: [...], conversion_rates: {...} }

# Time Metrics
GET /api/analytics/time-metrics
Response: {
  avg_time_to_hire: number,
  avg_time_to_interview: number,
  time_by_stage: {...},
  trends: [...]
}

# Source Effectiveness
GET /api/analytics/sources
Response: {
  sources: [{
    name: string,
    candidates: number,
    hired: number,
    conversion_rate: number,
    avg_quality: number
  }]
}

# Recruiter Performance
GET /api/analytics/recruiters
Response: {
  recruiters: [{
    name: string,
    candidates_processed: number,
    interviews_scheduled: number,
    hires: number,
    avg_time_to_hire: number
  }]
}

# Custom Reports
POST /api/analytics/report/create
GET /api/analytics/report/list
GET /api/analytics/report/{id}
POST /api/analytics/report/{id}/generate
DELETE /api/analytics/report/{id}

# Export
GET /api/analytics/export/pdf
GET /api/analytics/export/excel
GET /api/analytics/export/csv

# Predictive
GET /api/analytics/predict/time-to-hire
GET /api/analytics/predict/candidate-success
GET /api/analytics/insights
```

### UI Components

```
/recruiter/analytics
  - Overview dashboard
  - Pipeline funnel
  - Time metrics charts
  - Source comparison
  - Recruiter leaderboard

/recruiter/analytics/pipeline
  - Detailed funnel view
  - Stage-by-stage breakdown
  - Conversion rates
  - Drop-off analysis

/recruiter/analytics/reports
  - Custom report builder
  - Saved reports list
  - Schedule reports
  - Export options

/recruiter/analytics/insights
  - AI-powered insights
  - Recommendations
  - Trend predictions
  - Anomaly detection
```

### Dashboard Mockup

```
┌─────────────────────────────────────────────────────┐
│  📊 Analytics Dashboard                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Last 30 Days ▼]  [All Jobs ▼]  [Export ▼]       │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │ 📥 Total │ │ ⏱️ Avg   │ │ ✅ Hired │ │ 📈 Rate││
│  │   245    │ │ 12 days  │ │    18    │ │  7.3%  ││
│  │Candidates│ │Time-Hire │ │          │ │        ││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                     │
│  Hiring Funnel                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │ Applied (245)     ████████████████████ 100% │  │
│  │ Screening (180)   ██████████████      73%   │  │
│  │ Interview (65)    █████              27%    │  │
│  │ Offer (25)        ██                 10%    │  │
│  │ Hired (18)        █                   7%    │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Time to Hire Trend                                 │
│  ┌─────────────────────────────────────────────┐  │
│  │     •                                        │  │
│  │   •   •     •                                │  │
│  │ •       • •   •   •                          │  │
│  │               • •   • •                      │  │
│  │                       •   •                  │  │
│  └─────────────────────────────────────────────┘  │
│  Jan    Feb    Mar    Apr    May    Jun         │  │
│                                                     │
│  Top Sources                                        │
│  ┌─────────────────────────────────────────────┐  │
│  │ LinkedIn        ████████████  85 (35%)      │  │
│  │ Referrals       ████████      52 (21%)      │  │
│  │ Job Boards      ██████        45 (18%)      │  │
│  │ Company Site    ████          38 (16%)      │  │
│  │ Other           ██            25 (10%)      │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Tasks

### Phase 1: Data Collection (Day 1)
- [ ] Add stage tracking to candidates
- [ ] Implement stage history
- [ ] Add source tracking
- [ ] Create analytics snapshots
- [ ] Build data aggregation service

### Phase 2: Core Analytics (Day 2)
- [ ] Calculate pipeline metrics
- [ ] Calculate time metrics
- [ ] Calculate conversion rates
- [ ] Build analytics API endpoints

### Phase 3: Dashboard UI (Day 3)
- [ ] Create analytics dashboard page
- [ ] Build pipeline funnel chart
- [ ] Add time metrics charts
- [ ] Create source comparison view
- [ ] Add recruiter performance table

### Phase 4: Custom Reports (Day 3-4)
- [ ] Build report builder UI
- [ ] Implement report generation
- [ ] Add scheduling system
- [ ] Create export functionality (PDF/Excel)

### Phase 5: Predictive Analytics (Day 4)
- [ ] Implement time-to-hire prediction
- [ ] Add candidate success prediction
- [ ] Generate AI insights
- [ ] Create insights UI

---

## ✅ Success Metrics

- <2 second dashboard load time
- 100+ data points tracked
- 10+ custom reports created
- 90% report accuracy
- 50+ insights generated per month

---

**Status:** Ready for implementation after Feature 1 & 2
