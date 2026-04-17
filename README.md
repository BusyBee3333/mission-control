# Mission Control

GHL Sub-Account Management System with AI Knowledgebase.

Built on patterns from [PatchyHub](https://github.com/PatchyToes/PatchyHub): module-based organization, asset linking, and S.C.A.L.E. comprehension scoring.

## Live Demo

**https://mission-control.jake-2ab.workers.dev**

## Features

### 3-Panel Interface
- **Left Panel**: Module navigator with collapsible tree
- **Center Panel**: Canvas visualization (Canvas, Kanban, Timeline, Table views)
- **Right Panel**: Context-aware detail editor

### Module-Based Organization
Every asset belongs to a functional module:
- **LC** - Lead Capture
- **AP** - Application Processing
- **48** - 48-Hour Window
- **CL** - Claim & Onboarding
- **RV** - Recovery

### Health Scoring
Each module gets a 0-100% health score based on:
- Documentation coverage
- Asset descriptions
- SOP linkage
- Cross-asset dependency mapping

### AI Chat (Grounded)
Ask questions about the system and get answers based on actual data:
- "What happens if someone misses the 48hr window?"
- "Which workflows send SMS messages?"
- "What's missing documentation?"

The AI only answers from system data - never makes up behavior.

## Three Knowledge Layers

| Layer | Description |
|-------|-------------|
| **A** | Technical Truth - Extracted from GHL exports |
| **B** | Human Knowledge - Descriptions, SOPs, the "why" |
| **C** | Strategic Context - What the system is FOR |

AI measures gaps between layers.

## Project Structure

```
mission-control/
├── src/
│   └── index.js           # Main Cloudflare Worker
├── data/
│   ├── modules/           # Module definitions
│   ├── assets/            # Asset registry
│   └── sops/              # SOP library
├── campaigns/             # Campaign data (from campaign-viz)
├── PLAN.md                # Complete implementation plan
├── wrangler.toml
└── package.json
```

## Development

```bash
# Local dev
wrangler dev

# Deploy
wrangler deploy
```

## Related Projects

- **Campaign Viz**: https://github.com/BusyBee3333/campaign-viz
- **Burton Method Analysis**: `realconnect-analysis/BURTON-SCAFFOLD-SPEC.md`
- **PatchyHub Patterns**: `realconnect-analysis/PATCHYHUB-ANALYSIS.md`

## Implementation Phases

### Phase 1: Core Interface (Current)
- [x] 3-panel responsive layout
- [x] Module navigator tree
- [x] Canvas view with modules
- [x] Detail panel with sequence messages
- [x] Kanban view
- [x] AI chat mockup

### Phase 2: Multi-View + Editing
- [ ] Timeline view
- [ ] Table view with bulk edit
- [ ] Full CRUD for all entities
- [ ] Inline message editing

### Phase 3: SOP System
- [ ] SOP library panel
- [ ] Markdown editor
- [ ] Asset linking (`@asset` syntax)
- [ ] Templates

### Phase 4: AI Integration
- [ ] Claude API integration
- [ ] Grounded answers from system data
- [ ] Gap detection and suggestions

### Phase 5: GHL Sync
- [ ] Import from GHL API
- [ ] Export to GHL
- [ ] Webhook handlers

## License

MIT
