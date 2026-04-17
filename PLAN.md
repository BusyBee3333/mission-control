# Mission Control - Complete Implementation Plan

> GHL Sub-Account Management System with AI Knowledgebase

## Executive Summary

Mission Control is a **birds-eye view interface** for managing GHL sub-accounts. Everything is visible, editable with 1-2 clicks, SOPs are linked to assets, and AI chat knows the entire system.

Built on patterns from PatchyHub analysis: module-based organization, asset linking, three knowledge layers (Technical Truth / Human Knowledge / Strategic Context), and S.C.A.L.E. comprehension scoring.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Burton Method]  │  Canvas ▾  │  Search...  │  Ask AI  │  [Export] [Deploy]│
├──────────────────┬──────────────────────────────────────────┬───────────────┤
│                  │                                          │               │
│   MODULE NAV     │           MAIN CANVAS                    │   DETAIL      │
│   (Collapsible   │   (Canvas / Kanban / Timeline / Table)   │   PANEL       │
│    Tree)         │                                          │  (In-place    │
│                  │                                          │   Editing)    │
│   + Workflows    │         [Visual representation           │               │
│   + Tags         │          of modules & sequences]         │   SOPs linked │
│   + Fields       │                                          │   AI suggests │
│   + Templates    │                                          │               │
│                  │                                          │               │
├──────────────────┤                                          ├───────────────┤
│   SOPs Library   │                                          │   AI Chat     │
└──────────────────┴──────────────────────────────────────────┴───────────────┘
```

---

## Data Model

### Module Schema

```typescript
interface Module {
  id: string;           // "48", "LC", "AP"
  name: string;         // "48-Hour Window"
  shortId: string;      // "48"
  description: string;
  functions: string[];  // What this module does
  assets: Asset[];
  customFields: CustomField[];
  trainingDocs: TrainingDoc[];
  healthScore: number;  // 0-100 completeness
}
```

### Asset Schema

```typescript
interface Asset {
  id: string;
  moduleId: string;
  type: AssetType;      // workflow, tag, custom_field, template, etc.
  name: string;
  description: string;
  seriesNumber?: number;
  metadata: Record<string, any>;
  links: AssetLink[];
  hasDoc: boolean;      // SOP linked?
}

type AssetType =
  | 'workflow'
  | 'tag'
  | 'custom_field'
  | 'custom_value'
  | 'pipeline'
  | 'pipeline_stage'
  | 'email_template'
  | 'sms_template'
  | 'form'
  | 'funnel'
  | 'calendar'
  | 'trigger_link';
```

### Asset Link Schema

```typescript
interface AssetLink {
  sourceAssetId: string;
  targetAssetId: string;
  linkType:
    | 'triggers'      // This asset triggers the target
    | 'triggered_by'  // This asset is triggered by source
    | 'sets'          // This asset sets/writes to target
    | 'reads'         // This asset reads from target
    | 'sends'         // This asset sends the target
    | 'starts'        // This workflow starts another
    | 'stops'         // This workflow stops another
    | 'adds'          // This asset adds target (tag)
    | 'removes';      // This asset removes target (tag)
  metadata?: {
    delay?: string;   // "24h", "3 days"
    condition?: string;
  };
}
```

### Sequence Schema (from Campaign Viz)

```typescript
interface Sequence {
  id: string;           // "1A", "W2"
  moduleId: string;
  name: string;
  phase: string;
  trigger: string;
  duration: string;
  methodology: string[];
  messages: Message[];
}

interface Message {
  id: string;
  timing: string;
  channel: 'sms' | 'email';
  subject?: string;
  content: string;
  methodology: string;
  charCount?: number;
}
```

### SOP Schema

```typescript
interface TrainingDoc {
  id: string;
  moduleId: string;
  title: string;
  content: string;       // Markdown
  linkedAssets: string[];
  version: number;
  updatedAt: string;
}
```

---

## Module Taxonomy

### Burton Method Modules

| ID | Name | Function | Assets |
|----|------|----------|--------|
| `LC` | Lead Capture | Application forms, initial tagging | 8 |
| `AP` | Application Processing | Review, acceptance/rejection | 5 |
| `48` | 48-Hour Window | Urgency sequence | 6 |
| `CL` | Claim & Onboarding | Customer setup | 7 |
| `NS` | Nurture Sequences | Long-term drips | 15 |
| `EV` | Event Triggers | Birthday, re-engagement | 8 |
| `OF` | Offers | Discount tiers, win-back | 6 |
| `WA` | Watch Analytics | Engagement-based routing | 4 |

### Signet AI Digest Modules

| ID | Name | Function | Assets |
|----|------|----------|--------|
| `DG` | Digest Content | Weekly newsletter | 6 |
| `EN` | Engagement | Page visit tracking | 8 |
| `VW` | Video Watch | Watch % automations | 12 |
| `DL` | Earned Deals | Engagement-triggered offers | 8 |

---

## Three Knowledge Layers

### Layer A: Technical Truth
- Extracted automatically from GHL exports
- Workflow JSON, asset metadata, link graph
- **Deterministic** - provable from import data

### Layer B: Human Knowledge
- Descriptions, SOPs, the "why"
- AI audits against Layer A for contradictions
- "Description says X, but workflow shows Y" = flag

### Layer C: Strategic Context
- What the system is FOR: DIY vs managed, industry, scale
- NOT inferable from data - requires questionnaire
- Without it, can't tell if 200 workflows is "right" or "bloat"

**Key insight:** AI measures gaps between layers.

---

## S.C.A.L.E. Comprehension Scoring

| Dimension | Question | Signals |
|-----------|----------|---------|
| **S**tandardize | Can AI identify assets? | Naming conventions, series numbers |
| **C**entralize | Can AI find answers? | Description presence, SOP linkage |
| **A**lign | Can AI explain WHY? | Purpose vs label coherence |
| **L**everage | Can AI predict impact? | Dependency graph awareness |
| **E**valuate | Can AI measure change? | Version history, checkpoints |

Each module gets a 0-100 health score based on these dimensions.

---

## UI Components

### 1. Module Navigator (Left Panel)

```
▼ Lead Capture (LC)                    [85%]
  ├── Workflows
  │   ├── LC-01: Application Handler     ●
  │   └── LC-02: Welcome Sequence        ●
  ├── Forms
  │   └── Burton Method Application      ○
  ├── Tags
  │   ├── Applied                        ○
  │   └── Quiz-Completed                 ○
  └── Custom Fields
      └── application_date               ●
```

**Indicators:**
- `●` = SOP linked
- `○` = No documentation
- `[85%]` = Module health score
- Click to select, right-click for context menu

### 2. Main Canvas (Center)

**Views:**
- **Canvas**: Visual node graph with D3/React Flow
- **Kanban**: Columns by phase or stage
- **Timeline**: Horizontal sequence timing
- **Table**: Spreadsheet-style bulk editing

### 3. Detail Panel (Right)

Context-aware based on selection:
- Sequence: Messages, timing, methodology
- Asset: Properties, links, SOP
- Module: Overview, health score, assets
- SOP: Markdown editor with asset linking

### 4. AI Chat (Bottom Right)

```
You: What happens if someone misses the 48hr window?

AI: According to the 48-Hour Window module (SOP: Window Management):

1. Workflow 48-04 fires at window_start + 48h
2. Condition: Stage != Claimed
3. Actions:
   - Opportunity → Lost
   - Tag: window-expired added
   - Starts: E5 (Re-engagement, 3-day delay)

📄 View: SOP: Window Expiry Handling
🔗 Jump to: Workflow 48-04
```

---

## API Endpoints

```
GET  /api/modules              List all modules
GET  /api/modules/:id          Get module with assets
POST /api/modules              Create module
PUT  /api/modules/:id          Update module

GET  /api/assets               List assets (filterable)
GET  /api/assets/:id           Get asset with links
POST /api/assets               Create asset
PUT  /api/assets/:id           Update asset

GET  /api/sequences            List sequences
GET  /api/sequences/:id        Get sequence with messages
PUT  /api/sequences/:id        Update sequence/messages

GET  /api/sops                 List SOPs
GET  /api/sops/:id             Get SOP content
POST /api/sops                 Create SOP
PUT  /api/sops/:id             Update SOP

GET  /api/links                Get asset link graph
POST /api/links                Create link
DELETE /api/links/:id          Remove link

POST /api/chat                 AI chat endpoint
GET  /api/health               System health/gaps
POST /api/export               Export to JSON/GHL
```

---

## Implementation Phases

### Phase 1: Core Interface (THIS BUILD)
- [x] 3-panel responsive layout
- [x] Module navigator tree
- [x] Canvas view with sequences
- [x] Detail panel with inline editing
- [x] Basic data model with sample modules

### Phase 2: Multi-View + Editing
- [ ] Kanban view
- [ ] Timeline view
- [ ] Table view with bulk edit
- [ ] Full CRUD for all entities

### Phase 3: SOP System
- [ ] SOP library panel
- [ ] Markdown editor with `@asset` linking
- [ ] Template library
- [ ] Version history

### Phase 4: AI Integration
- [ ] Chat panel component
- [ ] Claude API integration
- [ ] Grounded answers from system data
- [ ] Gap detection and suggestions

### Phase 5: GHL Sync
- [ ] Import from GHL API
- [ ] Export to GHL
- [ ] Real-time sync option
- [ ] Webhook handlers

---

## File Structure

```
mission-control/
├── src/
│   └── index.js           # Main Cloudflare Worker
├── data/
│   ├── modules/
│   │   ├── LC.json        # Lead Capture
│   │   ├── 48.json        # 48-Hour Window
│   │   ├── CL.json        # Claim & Onboarding
│   │   └── ...
│   ├── assets/
│   │   └── asset-registry.json
│   ├── sops/
│   │   └── sop-library.json
│   └── links/
│       └── asset-links.json
├── campaigns/
│   ├── burton-method.json
│   └── signet-digest.json
├── wrangler.toml
├── package.json
├── PLAN.md
└── README.md
```

---

## Technical Stack

- **Frontend**: Vanilla JS + D3.js (single-file Worker)
- **Backend**: Cloudflare Workers
- **Storage**: Inline JSON (Phase 1), D1/KV (Phase 2+)
- **AI**: Claude API (Phase 4)

---

## Key UX Principles

1. **Never more than 2 clicks** - Edit, add, view SOP
2. **Context preserved** - Panels slide, never replace
3. **Everything inline** - No "Edit Page", just edit
4. **Visual feedback** - Unsaved (yellow), missing doc (red)
5. **Grounded AI** - Never makes up system behavior

---

## Related Projects

- **Campaign Viz**: `/signet` and `/burton` visualizations
- **PatchyHub Analysis**: Patterns source
- **Real Connect Analysis**: Conversion psychology data
- **GHL Skills**: API integration patterns

---

## Success Metrics

- Time to find any asset: < 5 seconds
- Time to edit a message: < 3 seconds
- SOP coverage: > 80% of assets
- AI answer accuracy: 100% grounded
- Module health scores: All > 70%
