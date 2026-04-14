# 💼 Feature 7: Offer Management

**Status:** 📋 PLANNED  
**Priority:** LOW  
**Estimated Effort:** 3 days  
**Dependencies:** Feature 2 (Team Collaboration)

---

## 🎯 Overview

Complete offer management system with templates, compensation calculator, approval workflows, e-signature integration, and offer tracking.

### Problem Statement
- Manual offer letter creation is time-consuming
- No standardized offer process
- Difficult to track offer status
- No approval workflow
- Compensation decisions lack data

### Solution
- Offer letter templates
- Compensation calculator with market data
- Multi-level approval workflow
- E-signature integration (DocuSign/HelloSign)
- Offer tracking and analytics
- Automated reminders

---

## 📋 Requirements

### Functional Requirements

#### 1. Offer Templates
- Create custom templates
- Variable placeholders (name, salary, start date)
- Multiple template versions
- Template approval process
- Legal review tracking

#### 2. Compensation Calculator
- Salary range recommendations
- Market data integration
- Equity calculator
- Benefits package builder
- Total compensation view
- Comparison with similar roles

#### 3. Offer Creation
- Select candidate
- Choose template
- Fill compensation details
- Add custom terms
- Preview offer letter
- Generate PDF

#### 4. Approval Workflow
- Multi-level approvals (Manager → HR → Finance)
- Approval routing rules
- Email notifications
- Approval comments
- Rejection with feedback
- Approval history

#### 5. E-Signature
- DocuSign integration
- HelloSign integration
- Send for signature
- Track signature status
- Automatic reminders
- Completed document storage

#### 6. Offer Tracking
- Offer status (draft, pending approval, sent, signed, declined)
- Days since sent
- Acceptance rate
- Decline reasons
- Offer expiration dates

---

## 🎨 Design

### Database Schema

```javascript
offer_templates: {
  _id: ObjectId,
  workspace_id: ObjectId,
  created_by: ObjectId,
  
  // Template
  name: string,
  description: string,
  template_html: string,
  template_variables: [string], // ["candidate_name", "salary", etc.]
  
  // Settings
  is_active: boolean,
  requires_legal_review: boolean,
  approval_required: boolean,
  
  // Metadata
  version: number,
  created_at: datetime,
  updated_at: datetime
}

offers: {
  _id: ObjectId,
  workspace_id: ObjectId,
  candidate_id: ObjectId,
  job_id: ObjectId,
  created_by: ObjectId,
  
  // Offer Details
  template_id: ObjectId,
  title: string,
  
  // Compensation
  base_salary: number,
  currency: string,
  salary_frequency: "annual" | "hourly",
  bonus: number,
  equity: {
    type: "stock_options" | "rsu" | "none",
    amount: number,
    vesting_schedule: string
  },
  benefits: [string],
  
  // Terms
  start_date: date,
  employment_type: "full_time" | "part_time" | "contract",
  location: string,
  remote_policy: string,
  probation_period_months: number,
  
  // Documents
  offer_letter_url: string,
  additional_documents: [string],
  
  // Status
  status: "draft" | "pending_approval" | "approved" | "sent" | "signed" | "declined" | "expired",
  sent_at: datetime,
  expires_at: datetime,
  signed_at: datetime,
  declined_at: datetime,
  decline_reason: string,
  
  // E-Signature
  signature_provider: "docusign" | "hellosign",
  signature_request_id: string,
  signature_status: string,
  
  // Metadata
  created_at: datetime,
  updated_at: datetime
}

offer_approvals: {
  _id: ObjectId,
  offer_id: ObjectId,
  
  // Approval
  approver_id: ObjectId,
  approver_role: string, // "hiring_manager", "hr", "finance"
  order: number,
  
  // Status
  status: "pending" | "approved" | "rejected",
  decision_at: datetime,
  comments: string,
  
  // Metadata
  created_at: datetime
}

compensation_benchmarks: {
  _id: ObjectId,
  job_title: string,
  location: string,
  experience_level: string,
  
  // Salary Data
  min_salary: number,
  median_salary: number,
  max_salary: number,
  percentile_25: number,
  percentile_75: number,
  
  // Metadata
  data_source: string,
  last_updated: datetime
}
```

### API Endpoints

```
# Templates
GET /api/offer/templates
POST /api/offer/template/create
GET /api/offer/template/{id}
PUT /api/offer/template/{id}
DELETE /api/offer/template/{id}

# Compensation
GET /api/offer/compensation/benchmark
Params: { job_title, location, experience }
Response: { salary_range: {...}, market_data: {...} }

POST /api/offer/compensation/calculate
Body: { base_salary, bonus, equity, benefits }
Response: { total_compensation: number, breakdown: {...} }

# Offers
POST /api/offer/create
GET /api/offer/list
GET /api/offer/{id}
PUT /api/offer/{id}
DELETE /api/offer/{id}

POST /api/offer/{id}/send
POST /api/offer/{id}/withdraw
POST /api/offer/{id}/extend-expiry

# Approvals
POST /api/offer/{id}/submit-for-approval
POST /api/offer/{id}/approve
POST /api/offer/{id}/reject
GET /api/offer/{id}/approval-status

# E-Signature
POST /api/offer/{id}/send-for-signature
GET /api/offer/{id}/signature-status
POST /api/offer/{id}/signature-webhook

# Analytics
GET /api/offer/analytics
Response: {
  total_offers: number,
  acceptance_rate: number,
  avg_time_to_accept: number,
  decline_reasons: [...]
}
```

### UI Components

```
/recruiter/offers
  - List all offers
  - Filter by status
  - Offer analytics

/recruiter/offers/create
  - Candidate selection
  - Template selection
  - Compensation form
  - Preview

/recruiter/offers/{id}
  - Offer details
  - Approval status
  - Signature status
  - Actions (send, withdraw, extend)

/recruiter/offers/templates
  - Template library
  - Create/edit templates
  - Preview templates

/settings/offers
  - Approval workflow configuration
  - E-signature settings
  - Default terms
```

### Offer Creation Flow

```
┌─────────────────────────────────────────┐
│  💼 Create Offer                        │
├─────────────────────────────────────────┤
│                                         │
│  Step 1: Select Candidate               │
│  [John Doe - Senior Backend Engineer]  │
│                                         │
│  Step 2: Choose Template                │
│  ○ Standard Full-Time Offer            │
│  ● Senior Engineer Offer               │
│  ○ Contract Offer                      │
│                                         │
│  Step 3: Compensation                   │
│  Base Salary: [$120,000]               │
│  Market Range: $110k - $140k           │
│  Percentile: 65th ▓▓▓▓▓▓░░░░           │
│                                         │
│  Annual Bonus: [$15,000]               │
│  Equity: [10,000 stock options]        │
│  Vesting: [4 years, 1 year cliff]      │
│                                         │
│  Total Compensation: $145,000/year     │
│                                         │
│  Step 4: Terms                          │
│  Start Date: [May 1, 2026]             │
│  Employment Type: [Full-Time ▼]        │
│  Location: [San Francisco, CA]         │
│  Remote: [Hybrid - 3 days/week]        │
│                                         │
│  Step 5: Benefits                       │
│  ☑ Health Insurance                    │
│  ☑ 401(k) Matching                     │
│  ☑ Unlimited PTO                       │
│  ☑ Learning Budget ($2,000/year)       │
│                                         │
│  [Preview Offer] [Save Draft] [Submit] │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation Tasks

### Phase 1: Templates (Day 1)
- [ ] Create template models
- [ ] Build template CRUD APIs
- [ ] Create template editor UI
- [ ] Add variable system
- [ ] Implement preview

### Phase 2: Compensation (Day 1-2)
- [ ] Integrate market data API
- [ ] Build compensation calculator
- [ ] Create compensation form UI
- [ ] Add equity calculator
- [ ] Show total comp breakdown

### Phase 3: Offer Creation (Day 2)
- [ ] Build offer creation flow
- [ ] Implement offer CRUD APIs
- [ ] Create offer detail page
- [ ] Add PDF generation
- [ ] Build offer list view

### Phase 4: Approvals (Day 2-3)
- [ ] Create approval workflow engine
- [ ] Build approval UI
- [ ] Add email notifications
- [ ] Implement approval routing
- [ ] Create approval history view

### Phase 5: E-Signature (Day 3)
- [ ] Integrate DocuSign API
- [ ] Integrate HelloSign API
- [ ] Build signature request flow
- [ ] Add webhook handlers
- [ ] Implement status tracking

---

## ✅ Success Metrics

- 90% offer acceptance rate
- 50% faster offer creation
- 100% approval compliance
- 95% signature completion

---

**Status:** Ready for implementation after Feature 2
