/**
 * Mission Control - GHL Sub-Account Management System
 *
 * 3-Panel interface for managing campaigns, workflows, and SOPs.
 * Built on PatchyHub patterns with S.C.A.L.E. comprehension scoring.
 */

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mission Control - GHL Sub-Account Management</title>
  <script src="https://d3js.org/d3.v7.min.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0a0c; color: #e4e4e7; overflow: hidden; }

    /* Main Layout */
    #app { display: flex; flex-direction: column; height: 100vh; }
    #header { height: 52px; background: #18181b; border-bottom: 1px solid #27272a; display: flex; align-items: center; padding: 0 20px; gap: 16px; flex-shrink: 0; }
    #main { flex: 1; display: flex; overflow: hidden; }

    /* Header */
    .logo { font-size: 16px; font-weight: 700; background: linear-gradient(90deg, #22c55e, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .account-select { background: #27272a; border: 1px solid #3f3f46; border-radius: 6px; padding: 6px 12px; color: #fafafa; font-size: 13px; cursor: pointer; }
    .view-tabs { display: flex; gap: 4px; margin-left: 20px; }
    .view-tab { padding: 6px 14px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #71717a; font-size: 12px; cursor: pointer; transition: all 0.15s; }
    .view-tab:hover { color: #a1a1aa; }
    .view-tab.active { background: #22c55e; color: black; border-color: #22c55e; }
    .header-search { flex: 1; max-width: 400px; margin: 0 20px; }
    .header-search input { width: 100%; background: #27272a; border: 1px solid #3f3f46; border-radius: 6px; padding: 8px 12px 8px 36px; color: #fafafa; font-size: 13px; }
    .header-search input::placeholder { color: #52525b; }
    .header-actions { display: flex; gap: 8px; margin-left: auto; }
    .header-btn { padding: 8px 16px; border: 1px solid #3f3f46; border-radius: 6px; background: transparent; color: #a1a1aa; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
    .header-btn:hover { border-color: #22c55e; color: #fafafa; }
    .header-btn.primary { background: #22c55e; border-color: #22c55e; color: black; }

    /* Left Panel - Module Navigator */
    #left-panel { width: 280px; background: #111113; border-right: 1px solid #27272a; display: flex; flex-direction: column; overflow: hidden; }
    .panel-header { padding: 16px; border-bottom: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; }
    .panel-header h3 { font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
    .panel-header button { width: 24px; height: 24px; border: none; background: #27272a; border-radius: 4px; color: #71717a; cursor: pointer; font-size: 14px; }
    .panel-header button:hover { background: #3f3f46; color: #fafafa; }
    #module-tree { flex: 1; overflow-y: auto; padding: 8px; }

    /* Module Tree */
    .module-item { margin-bottom: 4px; }
    .module-header { display: flex; align-items: center; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.1s; }
    .module-header:hover { background: #1f1f23; }
    .module-header.selected { background: #22c55e22; border: 1px solid #22c55e44; }
    .module-expand { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; color: #52525b; font-size: 10px; margin-right: 6px; }
    .module-icon { width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; margin-right: 8px; }
    .module-name { flex: 1; font-size: 13px; font-weight: 500; color: #fafafa; }
    .module-health { font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 600; }
    .module-health.high { background: #22c55e22; color: #4ade80; }
    .module-health.medium { background: #f59e0b22; color: #fbbf24; }
    .module-health.low { background: #ef444422; color: #f87171; }

    .module-children { margin-left: 22px; display: none; }
    .module-item.expanded > .module-children { display: block; }

    .asset-group { margin: 4px 0; }
    .asset-group-header { display: flex; align-items: center; padding: 4px 8px; color: #52525b; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; }
    .asset-group-header:hover { color: #71717a; }
    .asset-item { display: flex; align-items: center; padding: 6px 8px 6px 20px; border-radius: 4px; cursor: pointer; font-size: 12px; color: #a1a1aa; }
    .asset-item:hover { background: #1f1f23; color: #fafafa; }
    .asset-item.selected { background: #22c55e22; color: #22c55e; }
    .asset-doc-indicator { width: 6px; height: 6px; border-radius: 50%; margin-left: auto; }
    .asset-doc-indicator.has-doc { background: #22c55e; }
    .asset-doc-indicator.no-doc { background: #3f3f46; }

    /* SOP Section */
    #sop-section { border-top: 1px solid #27272a; max-height: 200px; overflow-y: auto; }
    .sop-item { display: flex; align-items: center; padding: 8px 16px; cursor: pointer; font-size: 12px; color: #a1a1aa; border-bottom: 1px solid #1f1f23; }
    .sop-item:hover { background: #1f1f23; color: #fafafa; }
    .sop-icon { margin-right: 8px; }

    /* Center Panel - Canvas */
    #center-panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }
    #canvas-toolbar { height: 44px; background: #111113; border-bottom: 1px solid #27272a; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
    .toolbar-group { display: flex; gap: 4px; }
    .toolbar-btn { padding: 6px 12px; border: 1px solid #3f3f46; border-radius: 4px; background: transparent; color: #71717a; font-size: 11px; cursor: pointer; }
    .toolbar-btn:hover { border-color: #52525b; color: #a1a1aa; }
    .toolbar-btn.active { background: #27272a; border-color: #52525b; color: #fafafa; }
    .toolbar-separator { width: 1px; height: 20px; background: #27272a; margin: 0 8px; }
    #canvas-container { flex: 1; position: relative; overflow: hidden; }
    #canvas { width: 100%; height: 100%; }

    /* Zoom Controls */
    #zoom-controls { position: absolute; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 4px; }
    .zoom-btn { width: 32px; height: 32px; border: 1px solid #27272a; background: #18181b; border-radius: 6px; color: #71717a; cursor: pointer; font-size: 16px; }
    .zoom-btn:hover { background: #27272a; color: #fafafa; }

    /* Stats Bar */
    #stats-bar { position: absolute; bottom: 20px; left: 20px; display: flex; gap: 16px; background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 10px 16px; }
    .stat { text-align: center; }
    .stat-value { font-size: 18px; font-weight: 700; color: #fafafa; }
    .stat-label { font-size: 9px; color: #52525b; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Right Panel - Detail */
    #right-panel { width: 420px; background: #111113; border-left: 1px solid #27272a; display: flex; flex-direction: column; overflow: hidden; }
    #right-panel.collapsed { width: 0; border: none; }
    #detail-header { padding: 16px; border-bottom: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; }
    #detail-header h2 { font-size: 14px; font-weight: 600; color: #fafafa; }
    #detail-content { flex: 1; overflow-y: auto; padding: 16px; }

    /* Detail Sections */
    .detail-section { margin-bottom: 24px; }
    .detail-section h4 { font-size: 10px; font-weight: 600; color: #52525b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .detail-field { margin-bottom: 12px; }
    .detail-label { font-size: 11px; color: #71717a; margin-bottom: 4px; }
    .detail-value { font-size: 13px; color: #fafafa; }
    .detail-input { width: 100%; background: #1f1f23; border: 1px solid #27272a; border-radius: 6px; padding: 8px 12px; color: #fafafa; font-size: 13px; }
    .detail-input:focus { border-color: #22c55e; outline: none; }
    .detail-select { width: 100%; background: #1f1f23; border: 1px solid #27272a; border-radius: 6px; padding: 8px 12px; color: #fafafa; font-size: 13px; }

    /* Message Cards */
    .message-card { background: #1f1f23; border: 1px solid #27272a; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
    .message-card.sms { border-left: 3px solid #22c55e; }
    .message-card.email { border-left: 3px solid #3b82f6; }
    .message-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .message-id { font-size: 11px; font-weight: 600; color: #71717a; }
    .message-meta { display: flex; gap: 6px; }
    .message-timing { font-size: 10px; color: #52525b; background: #27272a; padding: 2px 6px; border-radius: 4px; }
    .message-channel { font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
    .message-channel.sms { background: #22c55e22; color: #4ade80; }
    .message-channel.email { background: #3b82f622; color: #60a5fa; }
    .message-subject { font-size: 12px; font-weight: 500; color: #fafafa; margin-bottom: 6px; padding: 6px 8px; background: #27272a; border-radius: 4px; }
    .message-content { font-size: 11px; color: #a1a1aa; line-height: 1.5; white-space: pre-wrap; max-height: 150px; overflow-y: auto; padding: 8px; background: #0a0a0c; border-radius: 4px; font-family: 'SF Mono', Monaco, monospace; }
    .message-edit-btn { padding: 4px 8px; font-size: 10px; background: transparent; border: 1px solid #3f3f46; border-radius: 4px; color: #71717a; cursor: pointer; }
    .message-edit-btn:hover { background: #22c55e; border-color: #22c55e; color: black; }

    /* Linked SOPs */
    .linked-sop { display: flex; align-items: center; padding: 8px 10px; background: #1f1f23; border-radius: 6px; margin-bottom: 6px; cursor: pointer; }
    .linked-sop:hover { background: #27272a; }
    .linked-sop-icon { margin-right: 8px; color: #3b82f6; }
    .linked-sop-title { font-size: 12px; color: #fafafa; flex: 1; }
    .add-sop-btn { display: flex; align-items: center; justify-content: center; padding: 8px; border: 1px dashed #3f3f46; border-radius: 6px; color: #52525b; font-size: 11px; cursor: pointer; }
    .add-sop-btn:hover { border-color: #22c55e; color: #22c55e; }

    /* Connections */
    .connection-item { display: flex; align-items: center; padding: 6px 0; font-size: 12px; }
    .connection-type { color: #52525b; width: 80px; }
    .connection-target { color: #22c55e; cursor: pointer; }
    .connection-target:hover { text-decoration: underline; }

    /* AI Chat */
    #ai-chat { position: fixed; bottom: 20px; right: 460px; width: 380px; max-height: 500px; background: #18181b; border: 1px solid #27272a; border-radius: 12px; display: none; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.5); z-index: 1000; }
    #ai-chat.visible { display: flex; }
    #ai-chat-header { padding: 12px 16px; border-bottom: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; }
    #ai-chat-header h3 { font-size: 13px; font-weight: 600; color: #fafafa; display: flex; align-items: center; gap: 8px; }
    #ai-chat-close { background: none; border: none; color: #71717a; cursor: pointer; font-size: 16px; }
    #ai-chat-messages { flex: 1; overflow-y: auto; padding: 16px; max-height: 350px; }
    .ai-message { margin-bottom: 16px; }
    .ai-message.user { text-align: right; }
    .ai-message-content { display: inline-block; max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; }
    .ai-message.user .ai-message-content { background: #22c55e; color: black; }
    .ai-message.assistant .ai-message-content { background: #27272a; color: #fafafa; text-align: left; }
    .ai-links { margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
    .ai-link { font-size: 11px; color: #22c55e; background: #22c55e22; padding: 4px 8px; border-radius: 4px; cursor: pointer; }
    .ai-link:hover { background: #22c55e33; }
    #ai-chat-input { padding: 12px 16px; border-top: 1px solid #27272a; display: flex; gap: 8px; }
    #ai-chat-input input { flex: 1; background: #27272a; border: 1px solid #3f3f46; border-radius: 6px; padding: 8px 12px; color: #fafafa; font-size: 13px; }
    #ai-chat-input button { padding: 8px 16px; background: #22c55e; border: none; border-radius: 6px; color: black; font-weight: 600; cursor: pointer; }

    /* AI Chat Toggle */
    #ai-chat-toggle { position: fixed; bottom: 20px; right: 460px; width: 48px; height: 48px; background: linear-gradient(135deg, #22c55e, #06b6d4); border: none; border-radius: 50%; color: white; font-size: 20px; cursor: pointer; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); z-index: 999; }
    #ai-chat-toggle:hover { transform: scale(1.05); }
    #ai-chat-toggle.hidden { display: none; }

    /* Kanban View */
    #kanban-view { display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #0a0a0c; padding: 20px; overflow-x: auto; }
    #kanban-view.visible { display: block; }
    .kanban-container { display: flex; gap: 16px; height: 100%; }
    .kanban-column { width: 260px; min-width: 260px; background: #111113; border: 1px solid #27272a; border-radius: 10px; display: flex; flex-direction: column; max-height: 100%; }
    .kanban-column-header { padding: 12px 14px; border-bottom: 1px solid #27272a; display: flex; align-items: center; gap: 8px; }
    .kanban-column-header .dot { width: 8px; height: 8px; border-radius: 50%; }
    .kanban-column-header h4 { font-size: 12px; font-weight: 600; color: #fafafa; flex: 1; }
    .kanban-column-header .count { font-size: 10px; color: #52525b; }
    .kanban-column-body { flex: 1; overflow-y: auto; padding: 8px; }
    .kanban-card { background: #1f1f23; border: 1px solid #27272a; border-radius: 6px; padding: 10px; margin-bottom: 8px; cursor: pointer; }
    .kanban-card:hover { border-color: #22c55e; }
    .kanban-card-id { font-size: 10px; font-weight: 700; color: #22c55e; margin-bottom: 4px; }
    .kanban-card-name { font-size: 12px; color: #fafafa; margin-bottom: 6px; }
    .kanban-card-meta { font-size: 10px; color: #52525b; }
  </style>
</head>
<body>
  <div id="app">
    <!-- Header -->
    <header id="header">
      <span class="logo">Mission Control</span>
      <select class="account-select">
        <option>Burton Method</option>
        <option>Signet AI Digest</option>
      </select>
      <div class="view-tabs">
        <button class="view-tab active" data-view="canvas">Canvas</button>
        <button class="view-tab" data-view="kanban">Kanban</button>
        <button class="view-tab" data-view="timeline">Timeline</button>
        <button class="view-tab" data-view="table">Table</button>
      </div>
      <div class="header-search">
        <input type="text" placeholder="Search modules, assets, SOPs... (Cmd+K)" />
      </div>
      <div class="header-actions">
        <button class="header-btn" onclick="toggleAIChat()">Ask AI</button>
        <button class="header-btn">Export</button>
        <button class="header-btn primary">Deploy to GHL</button>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main">
      <!-- Left Panel: Module Navigator -->
      <aside id="left-panel">
        <div class="panel-header">
          <h3>Modules</h3>
          <button title="Add Module">+</button>
        </div>
        <div id="module-tree"></div>
        <div id="sop-section">
          <div class="panel-header">
            <h3>SOPs</h3>
            <button title="Add SOP">+</button>
          </div>
          <div class="sop-item"><span class="sop-icon">&#128196;</span> 48-Hour Window Management</div>
          <div class="sop-item"><span class="sop-icon">&#128196;</span> Application Processing Guide</div>
          <div class="sop-item"><span class="sop-icon">&#128196;</span> Claim Onboarding Checklist</div>
        </div>
      </aside>

      <!-- Center Panel: Canvas -->
      <section id="center-panel">
        <div id="canvas-toolbar">
          <div class="toolbar-group">
            <button class="toolbar-btn active">All Phases</button>
            <button class="toolbar-btn">Application</button>
            <button class="toolbar-btn">48hr Window</button>
            <button class="toolbar-btn">Claimed</button>
            <button class="toolbar-btn">Recovery</button>
          </div>
          <div class="toolbar-separator"></div>
          <div class="toolbar-group">
            <button class="toolbar-btn">Show Links</button>
            <button class="toolbar-btn">Show Gaps</button>
          </div>
        </div>
        <div id="canvas-container">
          <svg id="canvas"></svg>
          <div id="kanban-view"></div>
          <div id="zoom-controls">
            <button class="zoom-btn" id="zoom-in">+</button>
            <button class="zoom-btn" id="zoom-out">-</button>
            <button class="zoom-btn" id="zoom-reset">&#8634;</button>
          </div>
          <div id="stats-bar">
            <div class="stat"><div class="stat-value">8</div><div class="stat-label">Modules</div></div>
            <div class="stat"><div class="stat-value">18</div><div class="stat-label">Sequences</div></div>
            <div class="stat"><div class="stat-value">47</div><div class="stat-label">Messages</div></div>
            <div class="stat"><div class="stat-value">12</div><div class="stat-label">SOPs</div></div>
            <div class="stat"><div class="stat-value">85%</div><div class="stat-label">Health</div></div>
          </div>
        </div>
      </section>

      <!-- Right Panel: Detail -->
      <aside id="right-panel">
        <div id="detail-header">
          <h2 id="detail-title">Select an item</h2>
          <button onclick="closeDetail()" style="background:none;border:none;color:#71717a;cursor:pointer;font-size:18px;">&times;</button>
        </div>
        <div id="detail-content">
          <p style="color:#52525b;font-size:13px;text-align:center;margin-top:40px;">Click a module or sequence to view details</p>
        </div>
      </aside>
    </main>
  </div>

  <!-- AI Chat -->
  <button id="ai-chat-toggle" onclick="toggleAIChat()">&#128172;</button>
  <div id="ai-chat">
    <div id="ai-chat-header">
      <h3>&#128172; Ask about Burton Method</h3>
      <button id="ai-chat-close" onclick="toggleAIChat()">&times;</button>
    </div>
    <div id="ai-chat-messages">
      <div class="ai-message assistant">
        <div class="ai-message-content">
          Hi! I can answer questions about the Burton Method system. Try asking:
          <br><br>
          "What happens if someone misses the 48hr window?"
          <br>
          "Which workflows send SMS messages?"
          <br>
          "What's missing documentation?"
        </div>
      </div>
    </div>
    <div id="ai-chat-input">
      <input type="text" placeholder="Ask a question..." />
      <button onclick="sendAIMessage()">Send</button>
    </div>
  </div>

  <script>
    // ===================== DATA =====================

    const systemData = {
      account: "Burton Method",
      modules: [
        {
          id: "LC",
          name: "Lead Capture",
          icon: "&#128205;",
          color: "#3b82f6",
          health: 92,
          description: "Handles inbound leads, application forms, initial tagging",
          assets: {
            workflows: [
              { id: "LC-01", name: "Application Handler", hasDoc: true },
              { id: "LC-02", name: "Welcome Sequence", hasDoc: true }
            ],
            forms: [
              { id: "LC-F1", name: "Burton Method Application", hasDoc: false }
            ],
            tags: [
              { id: "LC-T1", name: "Applied", hasDoc: false },
              { id: "LC-T2", name: "Quiz-Completed", hasDoc: false }
            ],
            customFields: [
              { id: "LC-CF1", name: "application_date", hasDoc: true }
            ]
          },
          sequences: [
            { id: "A1", name: "Application Received", trigger: "Form Submit", messages: 2 },
            { id: "A2", name: "Application Review", trigger: "24hr No Decision", messages: 1 },
            { id: "A3", name: "More Info Needed", trigger: "Incomplete App", messages: 1 }
          ]
        },
        {
          id: "AP",
          name: "Application Processing",
          icon: "&#128203;",
          color: "#8b5cf6",
          health: 78,
          description: "Reviews applications, triggers acceptance/rejection",
          assets: {
            workflows: [
              { id: "AP-01", name: "Review Queue", hasDoc: true },
              { id: "AP-02", name: "Acceptance Trigger", hasDoc: true },
              { id: "AP-03", name: "Rejection Handler", hasDoc: false }
            ],
            tags: [
              { id: "AP-T1", name: "Under-Review", hasDoc: false },
              { id: "AP-T2", name: "Accepted", hasDoc: true }
            ]
          },
          sequences: [
            { id: "B1", name: "Acceptance Notification", trigger: "Approved", messages: 2 },
            { id: "B2", name: "Welcome + Next Steps", trigger: "1hr Post-Accept", messages: 1 }
          ]
        },
        {
          id: "48",
          name: "48-Hour Window",
          icon: "&#9200;",
          color: "#ef4444",
          health: 95,
          description: "Creates urgency through a time-limited claim window",
          assets: {
            workflows: [
              { id: "48-01", name: "Window Start", hasDoc: true },
              { id: "48-02", name: "24hr Reminder", hasDoc: true },
              { id: "48-03", name: "6hr Urgent", hasDoc: true },
              { id: "48-04", name: "Expiry Handler", hasDoc: true }
            ],
            customFields: [
              { id: "48-CF1", name: "window_start", hasDoc: true },
              { id: "48-CF2", name: "window_end", hasDoc: true }
            ]
          },
          sequences: [
            { id: "W1", name: "Window Started", trigger: "Acceptance", messages: 2 },
            { id: "W2", name: "24hr Reminder", trigger: "24hr Mark", messages: 2 },
            { id: "W3", name: "6hr Warning", trigger: "42hr Mark", messages: 2 },
            { id: "W4", name: "1hr Final", trigger: "47hr Mark", messages: 2 },
            { id: "W5", name: "15min Countdown", trigger: "47hr45min", messages: 1 }
          ]
        },
        {
          id: "CL",
          name: "Claim & Onboarding",
          icon: "&#127881;",
          color: "#22c55e",
          health: 88,
          description: "Claim completion, welcome sequence, customer setup",
          assets: {
            workflows: [
              { id: "CL-01", name: "Claim Handler", hasDoc: true },
              { id: "CL-02", name: "Onboarding Sequence", hasDoc: true },
              { id: "CL-03", name: "Day 1 Check-in", hasDoc: false }
            ],
            tags: [
              { id: "CL-T1", name: "Claimed", hasDoc: true },
              { id: "CL-T2", name: "Customer", hasDoc: true }
            ]
          },
          sequences: [
            { id: "C1", name: "Claim Confirmed", trigger: "Payment", messages: 2 },
            { id: "C2", name: "Onboarding Start", trigger: "1hr Post-Claim", messages: 1 },
            { id: "C3", name: "Day 1 Check-in", trigger: "24hr Post-Claim", messages: 1 }
          ]
        },
        {
          id: "RV",
          name: "Recovery",
          icon: "&#128260;",
          color: "#f59e0b",
          health: 72,
          description: "Window expired re-engagement paths",
          assets: {
            workflows: [
              { id: "RV-01", name: "Expiry Handler", hasDoc: true },
              { id: "RV-02", name: "Re-engagement 3d", hasDoc: false },
              { id: "RV-03", name: "Waitlist Offer", hasDoc: false }
            ],
            tags: [
              { id: "RV-T1", name: "Window-Expired", hasDoc: true }
            ]
          },
          sequences: [
            { id: "R1", name: "Window Expired", trigger: "48hr No Claim", messages: 1 },
            { id: "R2", name: "Re-engagement", trigger: "3 Days Post", messages: 1 },
            { id: "R3", name: "Waitlist Offer", trigger: "7 Days Post", messages: 1 },
            { id: "R4", name: "Final Re-engagement", trigger: "14 Days Post", messages: 1 }
          ]
        }
      ],
      sequenceMessages: {
        "W1": [
          { id: "W1-1", timing: "0min", channel: "email", subject: "You're in - 48 hours starts NOW", content: "{{first_name}},\\n\\nYou're accepted.\\n\\nYour 48-hour window to claim your spot starts right now.\\n\\nDeadline: {{window_end_timestamp}}\\n\\n..." },
          { id: "W1-2", timing: "0min", channel: "sms", content: "{{first_name}} - You're accepted! 48hr window starts NOW. Claim by {{window_end_short}}. Link in your email or reply here with questions. - Jake" }
        ],
        "W2": [
          { id: "W2-1", timing: "24hr", channel: "email", subject: "24 hours left - halfway point", content: "{{first_name}},\\n\\n24 hours down. 24 hours to go.\\n\\nYour window closes {{window_end_timestamp}}.\\n\\n..." },
          { id: "W2-2", timing: "24hr", channel: "sms", content: "{{first_name}} - 24 hours left on your window. Halfway point. If you're on the fence, reply and tell me what's holding you back. - Jake" }
        ],
        "W3": [
          { id: "W3-1", timing: "42hr", channel: "email", subject: "6 hours left - this is real", content: "{{first_name}},\\n\\n6 hours left.\\n\\nI'm not going to extend your window. I'm not going to make an exception...\\n\\n..." },
          { id: "W3-2", timing: "42hr", channel: "sms", content: "6 hours left {{first_name}}. Window closes {{window_end_short}}. This is your last real chance to think about it. After that, decide time. - Jake" }
        ],
        "W4": [
          { id: "W4-1", timing: "47hr", channel: "email", subject: "1 hour - final call", content: "{{first_name}},\\n\\n1 hour.\\n\\nYour window closes at {{window_end_timestamp}}.\\n\\nIf you want this, claim it now...\\n\\n..." },
          { id: "W4-2", timing: "47hr", channel: "sms", content: "1 HOUR LEFT {{first_name}}. Closes {{window_end_short}}. If you want it, now is the time: {{claim_link}}" }
        ],
        "W5": [
          { id: "W5-1", timing: "47hr45min", channel: "sms", content: "15 MINUTES. Window closes at {{window_end_short}}. Last chance: {{claim_link}} - After this, your spot goes to someone else. - Jake" }
        ],
        "C1": [
          { id: "C1-1", timing: "0min", channel: "email", subject: "You're in - let's go", content: "{{first_name}},\\n\\nYou did it. You're in.\\n\\nI'm genuinely excited to work with you...\\n\\n..." },
          { id: "C1-2", timing: "0min", channel: "sms", content: "YOU'RE IN {{first_name}}! Check your email for login details. I'll be in touch within 24hrs to schedule your first session. Let's go. - Jake" }
        ]
      }
    };

    // ===================== STATE =====================

    let currentView = 'canvas';
    let selectedModule = null;
    let selectedSequence = null;

    // ===================== RENDER =====================

    function renderModuleTree() {
      const tree = document.getElementById('module-tree');
      tree.innerHTML = systemData.modules.map(mod => {
        const healthClass = mod.health >= 85 ? 'high' : mod.health >= 70 ? 'medium' : 'low';
        return \`
          <div class="module-item" data-module-id="\${mod.id}">
            <div class="module-header" onclick="toggleModule('\${mod.id}')">
              <span class="module-expand">&#9656;</span>
              <span class="module-icon" style="background:\${mod.color}22;color:\${mod.color}">\${mod.icon}</span>
              <span class="module-name">\${mod.name}</span>
              <span class="module-health \${healthClass}">\${mod.health}%</span>
            </div>
            <div class="module-children">
              \${renderAssetGroups(mod)}
              <div class="asset-group">
                <div class="asset-group-header">&#128203; Sequences</div>
                \${mod.sequences.map(seq => \`
                  <div class="asset-item" onclick="selectSequence('\${mod.id}', '\${seq.id}')" data-seq-id="\${seq.id}">
                    \${seq.id}: \${seq.name}
                    <span class="asset-doc-indicator \${systemData.sequenceMessages[seq.id] ? 'has-doc' : 'no-doc'}"></span>
                  </div>
                \`).join('')}
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderAssetGroups(mod) {
      let html = '';
      if (mod.assets.workflows?.length) {
        html += \`
          <div class="asset-group">
            <div class="asset-group-header">&#9881; Workflows</div>
            \${mod.assets.workflows.map(a => \`
              <div class="asset-item" onclick="selectAsset('\${a.id}')">\${a.name}<span class="asset-doc-indicator \${a.hasDoc ? 'has-doc' : 'no-doc'}"></span></div>
            \`).join('')}
          </div>
        \`;
      }
      if (mod.assets.forms?.length) {
        html += \`
          <div class="asset-group">
            <div class="asset-group-header">&#128196; Forms</div>
            \${mod.assets.forms.map(a => \`
              <div class="asset-item" onclick="selectAsset('\${a.id}')">\${a.name}<span class="asset-doc-indicator \${a.hasDoc ? 'has-doc' : 'no-doc'}"></span></div>
            \`).join('')}
          </div>
        \`;
      }
      if (mod.assets.tags?.length) {
        html += \`
          <div class="asset-group">
            <div class="asset-group-header">&#127991; Tags</div>
            \${mod.assets.tags.map(a => \`
              <div class="asset-item" onclick="selectAsset('\${a.id}')">\${a.name}<span class="asset-doc-indicator \${a.hasDoc ? 'has-doc' : 'no-doc'}"></span></div>
            \`).join('')}
          </div>
        \`;
      }
      if (mod.assets.customFields?.length) {
        html += \`
          <div class="asset-group">
            <div class="asset-group-header">&#128221; Custom Fields</div>
            \${mod.assets.customFields.map(a => \`
              <div class="asset-item" onclick="selectAsset('\${a.id}')">\${a.name}<span class="asset-doc-indicator \${a.hasDoc ? 'has-doc' : 'no-doc'}"></span></div>
            \`).join('')}
          </div>
        \`;
      }
      return html;
    }

    function toggleModule(modId) {
      const item = document.querySelector(\`[data-module-id="\${modId}"]\`);
      item.classList.toggle('expanded');
      const expand = item.querySelector('.module-expand');
      expand.innerHTML = item.classList.contains('expanded') ? '&#9662;' : '&#9656;';
      selectModuleDetail(modId);
    }

    function selectModuleDetail(modId) {
      const mod = systemData.modules.find(m => m.id === modId);
      if (!mod) return;

      selectedModule = mod;
      document.querySelectorAll('.module-header').forEach(h => h.classList.remove('selected'));
      document.querySelector(\`[data-module-id="\${modId}"] .module-header\`).classList.add('selected');

      const content = document.getElementById('detail-content');
      document.getElementById('detail-title').textContent = mod.name;

      const totalAssets = (mod.assets.workflows?.length || 0) + (mod.assets.forms?.length || 0) +
                          (mod.assets.tags?.length || 0) + (mod.assets.customFields?.length || 0);
      const docCount = [...(mod.assets.workflows || []), ...(mod.assets.forms || []),
                        ...(mod.assets.tags || []), ...(mod.assets.customFields || [])]
                        .filter(a => a.hasDoc).length;

      content.innerHTML = \`
        <div class="detail-section">
          <h4>Module Info</h4>
          <div class="detail-field">
            <div class="detail-label">ID</div>
            <div class="detail-value">\${mod.id}</div>
          </div>
          <div class="detail-field">
            <div class="detail-label">Description</div>
            <textarea class="detail-input" rows="3">\${mod.description}</textarea>
          </div>
          <div class="detail-field">
            <div class="detail-label">Health Score</div>
            <div class="detail-value" style="color:\${mod.health >= 85 ? '#4ade80' : mod.health >= 70 ? '#fbbf24' : '#f87171'}">\${mod.health}%</div>
          </div>
        </div>
        <div class="detail-section">
          <h4>Assets (\${totalAssets})</h4>
          <div class="detail-field">
            <div class="detail-label">Documentation Coverage</div>
            <div class="detail-value">\${docCount}/\${totalAssets} assets have SOPs</div>
          </div>
        </div>
        <div class="detail-section">
          <h4>Sequences (\${mod.sequences.length})</h4>
          \${mod.sequences.map(seq => \`
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #27272a;font-size:12px;">
              <span style="color:#22c55e;font-weight:600;">\${seq.id}</span>
              <span style="color:#fafafa;">\${seq.name}</span>
              <span style="color:#52525b;">\${seq.messages} msgs</span>
            </div>
          \`).join('')}
        </div>
        <div class="detail-section">
          <h4>Linked SOPs</h4>
          <div class="linked-sop"><span class="linked-sop-icon">&#128196;</span><span class="linked-sop-title">SOP: \${mod.name} Overview</span></div>
          <div class="add-sop-btn">+ Link SOP</div>
        </div>
      \`;
    }

    function selectSequence(modId, seqId) {
      const mod = systemData.modules.find(m => m.id === modId);
      const seq = mod?.sequences.find(s => s.id === seqId);
      if (!seq) return;

      selectedSequence = seq;
      document.querySelectorAll('.asset-item').forEach(a => a.classList.remove('selected'));
      document.querySelector(\`[data-seq-id="\${seqId}"]\`)?.classList.add('selected');

      const messages = systemData.sequenceMessages[seqId] || [];
      document.getElementById('detail-title').textContent = \`\${seqId}: \${seq.name}\`;

      const content = document.getElementById('detail-content');
      content.innerHTML = \`
        <div class="detail-section">
          <h4>Sequence Info</h4>
          <div class="detail-field">
            <div class="detail-label">Trigger</div>
            <input class="detail-input" value="\${seq.trigger}" />
          </div>
          <div class="detail-field">
            <div class="detail-label">Module</div>
            <div class="detail-value">\${mod.name} (\${mod.id})</div>
          </div>
        </div>
        <div class="detail-section">
          <h4>Messages (\${messages.length})</h4>
          \${messages.map(msg => \`
            <div class="message-card \${msg.channel}">
              <div class="message-header">
                <span class="message-id">\${msg.id}</span>
                <div class="message-meta">
                  <span class="message-timing">\${msg.timing}</span>
                  <span class="message-channel \${msg.channel}">\${msg.channel.toUpperCase()}</span>
                </div>
              </div>
              \${msg.subject ? \`<div class="message-subject">\${msg.subject}</div>\` : ''}
              <div class="message-content">\${msg.content}</div>
            </div>
          \`).join('')}
          <div class="add-sop-btn">+ Add Message</div>
        </div>
        <div class="detail-section">
          <h4>Linked SOPs</h4>
          <div class="add-sop-btn">+ Link SOP</div>
        </div>
      \`;
    }

    function selectAsset(assetId) {
      document.getElementById('detail-title').textContent = assetId;
      document.getElementById('detail-content').innerHTML = \`
        <div class="detail-section">
          <h4>Asset Details</h4>
          <div class="detail-field">
            <div class="detail-label">ID</div>
            <div class="detail-value">\${assetId}</div>
          </div>
          <div class="detail-field">
            <div class="detail-label">Type</div>
            <div class="detail-value">Workflow</div>
          </div>
          <div class="detail-field">
            <div class="detail-label">Description</div>
            <textarea class="detail-input" rows="3" placeholder="Add description..."></textarea>
          </div>
        </div>
        <div class="detail-section">
          <h4>Linked SOPs</h4>
          <div class="add-sop-btn">+ Link SOP</div>
        </div>
      \`;
    }

    function closeDetail() {
      document.getElementById('right-panel').classList.add('collapsed');
    }

    // ===================== CANVAS =====================

    function drawCanvas() {
      const svg = d3.select('#canvas');
      const container = document.getElementById('canvas-container');
      const width = container.clientWidth;
      const height = container.clientHeight;
      svg.attr('viewBox', \`0 0 \${width} \${height}\`);

      const g = svg.append('g');
      const zoom = d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => g.attr('transform', e.transform));
      svg.call(zoom);

      // Draw modules as columns
      const moduleWidth = 200;
      const moduleGap = 40;
      const startX = 60;
      const startY = 40;

      systemData.modules.forEach((mod, i) => {
        const x = startX + i * (moduleWidth + moduleGap);
        const seqHeight = mod.sequences.length * 50 + 60;

        // Module box
        g.append('rect')
          .attr('x', x)
          .attr('y', startY)
          .attr('width', moduleWidth)
          .attr('height', seqHeight)
          .attr('rx', 10)
          .attr('fill', mod.color + '11')
          .attr('stroke', mod.color)
          .attr('stroke-width', 2);

        // Module header
        g.append('text')
          .attr('x', x + 15)
          .attr('y', startY + 25)
          .attr('fill', mod.color)
          .attr('font-size', '13px')
          .attr('font-weight', '700')
          .text(mod.name);

        // Health badge
        g.append('rect')
          .attr('x', x + moduleWidth - 45)
          .attr('y', startY + 12)
          .attr('width', 35)
          .attr('height', 18)
          .attr('rx', 9)
          .attr('fill', mod.health >= 85 ? '#22c55e22' : mod.health >= 70 ? '#f59e0b22' : '#ef444422');

        g.append('text')
          .attr('x', x + moduleWidth - 27)
          .attr('y', startY + 24)
          .attr('fill', mod.health >= 85 ? '#4ade80' : mod.health >= 70 ? '#fbbf24' : '#f87171')
          .attr('font-size', '10px')
          .attr('font-weight', '600')
          .attr('text-anchor', 'middle')
          .text(mod.health + '%');

        // Sequences
        mod.sequences.forEach((seq, j) => {
          const seqY = startY + 50 + j * 50;

          g.append('rect')
            .attr('x', x + 10)
            .attr('y', seqY)
            .attr('width', moduleWidth - 20)
            .attr('height', 40)
            .attr('rx', 6)
            .attr('fill', '#1f1f23')
            .attr('stroke', '#27272a')
            .style('cursor', 'pointer')
            .on('click', () => selectSequence(mod.id, seq.id));

          g.append('text')
            .attr('x', x + 20)
            .attr('y', seqY + 16)
            .attr('fill', mod.color)
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .text(seq.id);

          g.append('text')
            .attr('x', x + 20)
            .attr('y', seqY + 30)
            .attr('fill', '#fafafa')
            .attr('font-size', '11px')
            .text(seq.name.length > 20 ? seq.name.substring(0, 20) + '...' : seq.name);

          // Message count badge
          g.append('text')
            .attr('x', x + moduleWidth - 25)
            .attr('y', seqY + 24)
            .attr('fill', '#52525b')
            .attr('font-size', '10px')
            .text(seq.messages);
        });
      });

      // Zoom controls
      document.getElementById('zoom-in').onclick = () => svg.transition().call(zoom.scaleBy, 1.3);
      document.getElementById('zoom-out').onclick = () => svg.transition().call(zoom.scaleBy, 0.7);
      document.getElementById('zoom-reset').onclick = () => svg.transition().call(zoom.transform, d3.zoomIdentity);
    }

    // ===================== KANBAN =====================

    function renderKanban() {
      const kanban = document.getElementById('kanban-view');
      const phases = [
        { id: 'application', name: 'Application', color: '#3b82f6', modules: ['LC', 'AP'] },
        { id: 'window', name: '48hr Window', color: '#ef4444', modules: ['48'] },
        { id: 'claimed', name: 'Claimed', color: '#22c55e', modules: ['CL'] },
        { id: 'recovery', name: 'Recovery', color: '#f59e0b', modules: ['RV'] }
      ];

      kanban.innerHTML = \`
        <div class="kanban-container">
          \${phases.map(phase => {
            const mods = systemData.modules.filter(m => phase.modules.includes(m.id));
            const allSeqs = mods.flatMap(m => m.sequences.map(s => ({ ...s, moduleId: m.id, moduleName: m.name })));
            return \`
              <div class="kanban-column">
                <div class="kanban-column-header">
                  <span class="dot" style="background:\${phase.color}"></span>
                  <h4>\${phase.name}</h4>
                  <span class="count">\${allSeqs.length}</span>
                </div>
                <div class="kanban-column-body">
                  \${allSeqs.map(seq => \`
                    <div class="kanban-card" onclick="selectSequence('\${seq.moduleId}', '\${seq.id}')">
                      <div class="kanban-card-id">\${seq.id}</div>
                      <div class="kanban-card-name">\${seq.name}</div>
                      <div class="kanban-card-meta">\${seq.trigger} | \${seq.messages} msgs</div>
                    </div>
                  \`).join('')}
                </div>
              </div>
            \`;
          }).join('')}
        </div>
      \`;
    }

    // ===================== VIEWS =====================

    document.querySelectorAll('.view-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentView = tab.dataset.view;

        if (currentView === 'kanban') {
          document.getElementById('kanban-view').classList.add('visible');
          document.getElementById('canvas').style.display = 'none';
        } else {
          document.getElementById('kanban-view').classList.remove('visible');
          document.getElementById('canvas').style.display = 'block';
        }
      };
    });

    // ===================== AI CHAT =====================

    function toggleAIChat() {
      const chat = document.getElementById('ai-chat');
      const toggle = document.getElementById('ai-chat-toggle');
      chat.classList.toggle('visible');
      toggle.classList.toggle('hidden', chat.classList.contains('visible'));
    }

    function sendAIMessage() {
      const input = document.querySelector('#ai-chat-input input');
      const message = input.value.trim();
      if (!message) return;

      const messages = document.getElementById('ai-chat-messages');

      // User message
      messages.innerHTML += \`
        <div class="ai-message user">
          <div class="ai-message-content">\${message}</div>
        </div>
      \`;

      // Simulate AI response
      setTimeout(() => {
        let response = '';
        let links = [];

        if (message.toLowerCase().includes('48') || message.toLowerCase().includes('window')) {
          response = \`According to the <strong>48-Hour Window</strong> module:\\n\\n1. Workflow 48-04 fires at window_start + 48h\\n2. Condition: Stage != Claimed\\n3. Actions:\\n   - Opportunity -> Lost\\n   - Tag: window-expired added\\n   - Starts: R1 (Re-engagement)\\n\\nThe module has 95% health score with full documentation.\`;
          links = ['&#128196; SOP: 48-Hour Window Management', '&#128279; Workflow 48-04'];
        } else if (message.toLowerCase().includes('sms') || message.toLowerCase().includes('text')) {
          response = \`Workflows that send SMS messages:\\n\\n- <strong>W1</strong>: Acceptance notification\\n- <strong>W2</strong>: 24hr reminder\\n- <strong>W3</strong>: 6hr warning\\n- <strong>W4</strong>: 1hr final call\\n- <strong>W5</strong>: 15min countdown\\n- <strong>C1</strong>: Claim confirmation\\n\\nTotal: 8 SMS messages across 6 sequences.\`;
          links = ['&#128279; View all SMS templates'];
        } else if (message.toLowerCase().includes('missing') || message.toLowerCase().includes('gap')) {
          response = \`Documentation gaps detected:\\n\\n<strong>Missing SOPs:</strong>\\n- AP-03: Rejection Handler (0% documented)\\n- RV-02: Re-engagement 3d (0% documented)\\n- RV-03: Waitlist Offer (0% documented)\\n\\n<strong>Low Health Modules:</strong>\\n- Recovery: 72%\\n- Application Processing: 78%\\n\\nRecommendation: Prioritize documenting recovery workflows.\`;
          links = ['&#128196; Generate SOP for AP-03', '&#128202; View Health Dashboard'];
        } else {
          response = \`I can answer questions about the Burton Method system based on actual module data, not general knowledge.\\n\\nTry asking about:\\n- Specific workflows or sequences\\n- What triggers certain actions\\n- Documentation gaps\\n- Module dependencies\`;
        }

        messages.innerHTML += \`
          <div class="ai-message assistant">
            <div class="ai-message-content">\${response.replace(/\\n/g, '<br>')}</div>
            \${links.length ? \`<div class="ai-links">\${links.map(l => \`<span class="ai-link">\${l}</span>\`).join('')}</div>\` : ''}
          </div>
        \`;
        messages.scrollTop = messages.scrollHeight;
      }, 500);

      input.value = '';
    }

    // Enter key to send
    document.querySelector('#ai-chat-input input').addEventListener('keypress', e => {
      if (e.key === 'Enter') sendAIMessage();
    });

    // ===================== INIT =====================

    renderModuleTree();
    drawCanvas();
    renderKanban();
  <\/script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};
