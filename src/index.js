/**
 * Mission Control v2 - GHL Sub-Account Management System
 *
 * Rebuilt with Linear/Notion-inspired UX:
 * - Command palette (Cmd+K) for instant navigation
 * - Keyboard-first design (j/k navigation, shortcuts)
 * - Visual health indicators (progress bars)
 * - Inline editing without modals
 * - Breadcrumb context
 */

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mission Control</title>
  <script src="https://d3js.org/d3.v7.min.js"><\/script>
  <style>
    :root {
      --bg-0: #09090b;
      --bg-1: #0f0f12;
      --bg-2: #18181b;
      --bg-3: #1f1f23;
      --border: #27272a;
      --border-hover: #3f3f46;
      --text-0: #fafafa;
      --text-1: #a1a1aa;
      --text-2: #71717a;
      --text-3: #52525b;
      --accent: #22c55e;
      --accent-dim: rgba(34, 197, 94, 0.15);
      --blue: #3b82f6;
      --purple: #8b5cf6;
      --red: #ef4444;
      --amber: #f59e0b;
      --radius: 8px;
      --radius-sm: 4px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
      background: var(--bg-0);
      color: var(--text-0);
      overflow: hidden;
      font-size: 13px;
      line-height: 1.5;
    }

    /* ============ LAYOUT ============ */
    #app { display: flex; flex-direction: column; height: 100vh; }

    #topbar {
      height: 48px;
      background: var(--bg-1);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      flex-shrink: 0;
    }

    #main { flex: 1; display: flex; overflow: hidden; }

    /* ============ TOPBAR ============ */
    .logo {
      font-size: 14px;
      font-weight: 700;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo svg { width: 20px; height: 20px; }

    #breadcrumbs {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 20px;
      font-size: 12px;
    }
    .breadcrumb {
      color: var(--text-2);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      transition: all 0.1s;
    }
    .breadcrumb:hover { color: var(--text-1); background: var(--bg-3); }
    .breadcrumb.current { color: var(--text-0); cursor: default; }
    .breadcrumb.current:hover { background: transparent; }
    .breadcrumb-sep { color: var(--text-3); }

    #cmd-trigger {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text-2);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }
    #cmd-trigger:hover { border-color: var(--border-hover); color: var(--text-1); }
    #cmd-trigger kbd {
      background: var(--bg-3);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-family: inherit;
    }

    .topbar-actions { display: flex; gap: 8px; }
    .topbar-btn {
      padding: 6px 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: transparent;
      color: var(--text-1);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .topbar-btn:hover { border-color: var(--accent); color: var(--text-0); }
    .topbar-btn.primary { background: var(--accent); border-color: var(--accent); color: #000; }
    .topbar-btn.primary:hover { background: #16a34a; }

    /* ============ SIDEBAR ============ */
    #sidebar {
      width: 260px;
      background: var(--bg-1);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .sidebar-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sidebar-header h3 {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-2);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .sidebar-header button {
      width: 22px;
      height: 22px;
      border: none;
      background: transparent;
      border-radius: var(--radius-sm);
      color: var(--text-2);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sidebar-header button:hover { background: var(--bg-3); color: var(--text-0); }

    #module-list { flex: 1; overflow-y: auto; padding: 8px; }

    /* Module Items */
    .module-item { margin-bottom: 2px; }
    .module-row {
      display: flex;
      align-items: center;
      padding: 8px 10px;
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.1s;
      position: relative;
    }
    .module-row:hover { background: var(--bg-2); }
    .module-row.selected { background: var(--accent-dim); }
    .module-row.focused { box-shadow: inset 0 0 0 1px var(--accent); }

    .module-expand {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-3);
      font-size: 10px;
      margin-right: 4px;
      transition: transform 0.15s;
    }
    .module-item.expanded .module-expand { transform: rotate(90deg); }

    .module-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      margin-right: 10px;
    }

    .module-info { flex: 1; min-width: 0; }
    .module-name { font-size: 13px; font-weight: 500; color: var(--text-0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .module-meta { font-size: 10px; color: var(--text-3); margin-top: 2px; }

    /* Health Bar */
    .health-bar {
      width: 40px;
      height: 4px;
      background: var(--bg-3);
      border-radius: 2px;
      overflow: hidden;
      margin-left: 8px;
    }
    .health-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s;
    }
    .health-fill.high { background: var(--accent); }
    .health-fill.medium { background: var(--amber); }
    .health-fill.low { background: var(--red); }

    /* Nested Items */
    .module-children {
      margin-left: 24px;
      padding-left: 12px;
      border-left: 1px solid var(--border);
      display: none;
    }
    .module-item.expanded > .module-children { display: block; }

    .child-item {
      display: flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 12px;
      color: var(--text-1);
      margin: 1px 0;
      transition: all 0.1s;
    }
    .child-item:hover { background: var(--bg-2); color: var(--text-0); }
    .child-item.selected { background: var(--accent-dim); color: var(--accent); }
    .child-item.focused { box-shadow: inset 0 0 0 1px var(--accent); }

    .child-type {
      font-size: 10px;
      color: var(--text-3);
      width: 24px;
      text-align: center;
      margin-right: 6px;
    }
    .child-name { flex: 1; }
    .child-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-left: auto;
    }
    .child-indicator.doc { background: var(--accent); }
    .child-indicator.no-doc { background: var(--text-3); opacity: 0.4; }

    /* ============ CANVAS AREA ============ */
    #canvas-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #canvas-toolbar {
      height: 44px;
      background: var(--bg-1);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 8px;
    }

    .view-switcher {
      display: flex;
      background: var(--bg-2);
      border-radius: var(--radius);
      padding: 2px;
    }
    .view-btn {
      padding: 5px 12px;
      border: none;
      background: transparent;
      border-radius: 6px;
      color: var(--text-2);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.1s;
    }
    .view-btn:hover { color: var(--text-1); }
    .view-btn.active { background: var(--bg-3); color: var(--text-0); }

    .toolbar-sep {
      width: 1px;
      height: 20px;
      background: var(--border);
      margin: 0 8px;
    }

    .filter-chips { display: flex; gap: 4px; }
    .filter-chip {
      padding: 4px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: transparent;
      color: var(--text-2);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.1s;
    }
    .filter-chip:hover { border-color: var(--border-hover); color: var(--text-1); }
    .filter-chip.active { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); }

    #canvas-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: var(--bg-0);
    }
    #canvas { width: 100%; height: 100%; }

    /* Minimap */
    #minimap {
      position: absolute;
      bottom: 16px;
      left: 16px;
      width: 120px;
      height: 80px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      opacity: 0.8;
    }

    /* Stats */
    #stats {
      position: absolute;
      bottom: 16px;
      right: 16px;
      display: flex;
      gap: 12px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 10px 16px;
    }
    .stat { text-align: center; }
    .stat-value { font-size: 16px; font-weight: 700; color: var(--text-0); }
    .stat-label { font-size: 9px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; }

    /* Zoom */
    #zoom-controls {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .zoom-btn {
      width: 28px;
      height: 28px;
      border: 1px solid var(--border);
      background: var(--bg-2);
      border-radius: var(--radius);
      color: var(--text-2);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .zoom-btn:hover { background: var(--bg-3); color: var(--text-0); }

    /* ============ DETAIL PANEL ============ */
    #detail-panel {
      width: 380px;
      background: var(--bg-1);
      border-left: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: width 0.2s, opacity 0.2s;
    }
    #detail-panel.collapsed { width: 0; border: none; opacity: 0; pointer-events: none; }

    #detail-header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    #detail-header h2 {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-0);
      line-height: 1.4;
    }
    #detail-header .subtitle {
      font-size: 11px;
      color: var(--text-2);
      margin-top: 2px;
    }
    .close-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      border-radius: var(--radius-sm);
      color: var(--text-2);
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .close-btn:hover { background: var(--bg-3); color: var(--text-0); }

    #detail-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    /* Detail Sections */
    .detail-section { margin-bottom: 24px; }
    .detail-section h4 {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .field-group { margin-bottom: 14px; }
    .field-label {
      font-size: 11px;
      color: var(--text-2);
      margin-bottom: 4px;
    }
    .field-value {
      font-size: 13px;
      color: var(--text-0);
    }

    /* Inline Editable */
    .editable {
      cursor: text;
      padding: 6px 10px;
      margin: -6px -10px;
      border-radius: var(--radius-sm);
      transition: background 0.1s;
    }
    .editable:hover { background: var(--bg-2); }
    .editable:focus {
      background: var(--bg-2);
      outline: none;
      box-shadow: inset 0 0 0 1px var(--accent);
    }

    textarea.editable {
      width: calc(100% + 20px);
      resize: none;
      background: transparent;
      border: none;
      color: var(--text-0);
      font-size: 13px;
      font-family: inherit;
      line-height: 1.5;
    }

    /* Message Cards */
    .msg-card {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.1s;
    }
    .msg-card:hover { border-color: var(--border-hover); }
    .msg-card.sms { border-left: 3px solid var(--accent); }
    .msg-card.email { border-left: 3px solid var(--blue); }

    .msg-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .msg-id { font-size: 10px; font-weight: 700; color: var(--text-2); }
    .msg-badges { display: flex; gap: 4px; }
    .msg-badge {
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 10px;
      font-weight: 500;
    }
    .msg-badge.timing { background: var(--bg-3); color: var(--text-2); }
    .msg-badge.sms { background: var(--accent-dim); color: var(--accent); }
    .msg-badge.email { background: rgba(59, 130, 246, 0.15); color: var(--blue); }

    .msg-subject {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-0);
      margin-bottom: 6px;
      padding: 6px 8px;
      background: var(--bg-3);
      border-radius: var(--radius-sm);
    }
    .msg-preview {
      font-size: 11px;
      color: var(--text-2);
      line-height: 1.5;
      max-height: 60px;
      overflow: hidden;
    }

    /* Link Pills */
    .link-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .link-pill {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      font-size: 11px;
      color: var(--text-1);
      cursor: pointer;
      transition: all 0.1s;
    }
    .link-pill:hover { border-color: var(--accent); color: var(--accent); }
    .link-pill .icon { font-size: 12px; }

    .add-link {
      padding: 6px 10px;
      border: 1px dashed var(--border);
      border-radius: var(--radius);
      background: transparent;
      color: var(--text-3);
      font-size: 11px;
      cursor: pointer;
      transition: all 0.1s;
    }
    .add-link:hover { border-color: var(--accent); color: var(--accent); }

    /* ============ COMMAND PALETTE ============ */
    #cmd-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding-top: 120px;
      z-index: 1000;
    }
    #cmd-overlay.visible { display: flex; }

    #cmd-palette {
      width: 560px;
      max-height: 420px;
      background: var(--bg-1);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #cmd-input-wrap {
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    #cmd-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      font-size: 16px;
      color: var(--text-0);
      font-family: inherit;
    }
    #cmd-input::placeholder { color: var(--text-3); }

    #cmd-results {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    }

    .cmd-group { margin-bottom: 12px; }
    .cmd-group-label {
      font-size: 10px;
      font-weight: 600;
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 12px;
      margin-bottom: 4px;
    }

    .cmd-item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      border-radius: var(--radius);
      cursor: pointer;
      transition: background 0.05s;
    }
    .cmd-item:hover, .cmd-item.selected { background: var(--bg-3); }
    .cmd-item .icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      margin-right: 12px;
    }
    .cmd-item .label { flex: 1; font-size: 13px; color: var(--text-0); }
    .cmd-item .meta { font-size: 11px; color: var(--text-3); }
    .cmd-item .shortcut {
      font-size: 10px;
      background: var(--bg-2);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-2);
    }

    #cmd-footer {
      padding: 10px 16px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 16px;
      font-size: 11px;
      color: var(--text-3);
    }
    #cmd-footer span { display: flex; align-items: center; gap: 4px; }
    #cmd-footer kbd {
      background: var(--bg-3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: inherit;
    }

    /* ============ AI ASSISTANT ============ */
    #ai-toggle {
      position: fixed;
      bottom: 20px;
      right: 420px;
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--accent), #06b6d4);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      z-index: 900;
      transition: transform 0.15s;
    }
    #ai-toggle:hover { transform: scale(1.08); }
    #ai-toggle.hidden { display: none; }

    #ai-panel {
      position: fixed;
      bottom: 20px;
      right: 420px;
      width: 360px;
      max-height: 480px;
      background: var(--bg-1);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      display: none;
      flex-direction: column;
      z-index: 1000;
    }
    #ai-panel.visible { display: flex; }

    #ai-header {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    #ai-header h3 {
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #ai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      max-height: 340px;
    }
    .ai-msg { margin-bottom: 14px; }
    .ai-msg.user { text-align: right; }
    .ai-msg-bubble {
      display: inline-block;
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
    }
    .ai-msg.user .ai-msg-bubble { background: var(--accent); color: #000; }
    .ai-msg.bot .ai-msg-bubble { background: var(--bg-3); color: var(--text-0); text-align: left; }

    .ai-quick-links { margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
    .ai-quick-link {
      font-size: 10px;
      padding: 4px 8px;
      background: var(--accent-dim);
      color: var(--accent);
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .ai-quick-link:hover { background: rgba(34, 197, 94, 0.25); }

    #ai-input-wrap {
      padding: 12px 16px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 8px;
    }
    #ai-input {
      flex: 1;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 8px 12px;
      color: var(--text-0);
      font-size: 13px;
      font-family: inherit;
    }
    #ai-input:focus { border-color: var(--accent); outline: none; }
    #ai-send {
      padding: 8px 14px;
      background: var(--accent);
      border: none;
      border-radius: var(--radius);
      color: #000;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
    }
    #ai-send:hover { background: #16a34a; }

    /* ============ KEYBOARD HINT ============ */
    #keyboard-hint {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 8px 16px;
      font-size: 11px;
      color: var(--text-2);
      display: flex;
      gap: 16px;
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
      z-index: 100;
    }
    #keyboard-hint.visible { opacity: 1; }
    #keyboard-hint kbd {
      background: var(--bg-3);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-1);
    }

    /* ============ SCROLLBAR ============ */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }

    /* ============ MOBILE ============ */
    @media (max-width: 768px) {
      body { overflow: auto; }
      #app { height: auto; min-height: 100vh; }

      #topbar {
        height: auto;
        flex-wrap: wrap;
        padding: 12px;
        gap: 10px;
      }
      #breadcrumbs { display: none; }
      #cmd-trigger { order: 3; width: 100%; margin: 0; justify-content: center; }
      #cmd-trigger kbd { display: none; }
      .topbar-actions { order: 2; margin-left: auto; }

      #main { flex-direction: column; height: auto; }

      #sidebar {
        width: 100%;
        max-height: 50vh;
        border-right: none;
        border-bottom: 1px solid var(--border);
      }

      #canvas-area { min-height: 60vh; }
      #canvas-toolbar { flex-wrap: wrap; height: auto; padding: 10px; gap: 8px; }
      .view-switcher { width: 100%; }
      .view-btn { flex: 1; text-align: center; }
      .toolbar-sep { display: none; }
      .filter-chips { width: 100%; overflow-x: auto; flex-wrap: nowrap; }
      .filter-chip { white-space: nowrap; }

      #detail-panel {
        position: fixed;
        inset: 0;
        width: 100% !important;
        z-index: 1000;
        transition: transform 0.3s;
      }
      #detail-panel.collapsed { transform: translateX(100%); opacity: 1; pointer-events: none; }
      #detail-panel:not(.collapsed) { transform: translateX(0); }

      #stats { left: 10px; right: 10px; bottom: 10px; flex-wrap: wrap; justify-content: center; gap: 16px; }
      #zoom-controls { top: 10px; right: 10px; }

      #cmd-palette { width: 95%; max-width: 400px; margin: 20px; }

      #ai-toggle { right: 20px; bottom: 80px; }
      #ai-panel { right: 10px; left: 10px; width: auto; bottom: 80px; }

      #keyboard-hint { display: none; }

      /* Touch-friendly tap targets */
      .module-row { padding: 12px; }
      .child-item { padding: 10px; }
      .cmd-item { padding: 14px 12px; }
      .topbar-btn { padding: 10px 16px; }
    }

    @media (max-width: 480px) {
      .logo span { display: none; }
      .topbar-btn:not(.primary) { display: none; }
      #stats { padding: 8px 12px; }
      .stat-value { font-size: 14px; }
    }
  </style>
</head>
<body>
  <div id="app">
    <!-- Topbar -->
    <header id="topbar">
      <div class="logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
          <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
        </svg>
        Mission Control
      </div>

      <nav id="breadcrumbs">
        <span class="breadcrumb" onclick="goHome()">Home</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb current" id="bc-current">All Modules</span>
      </nav>

      <button id="cmd-trigger" onclick="openCmdPalette()">
        Search or jump to... <kbd>⌘K</kbd>
      </button>

      <div class="topbar-actions">
        <button class="topbar-btn" onclick="toggleAI()">Ask AI</button>
        <button class="topbar-btn primary">Deploy</button>
      </div>
    </header>

    <!-- Main -->
    <main id="main">
      <!-- Sidebar -->
      <aside id="sidebar">
        <div class="sidebar-header">
          <h3>Modules</h3>
          <button title="Add module">+</button>
        </div>
        <div id="module-list"></div>
      </aside>

      <!-- Canvas -->
      <section id="canvas-area">
        <div id="canvas-toolbar">
          <div class="view-switcher">
            <button class="view-btn active" data-view="canvas">Canvas</button>
            <button class="view-btn" data-view="kanban">Kanban</button>
            <button class="view-btn" data-view="table">Table</button>
          </div>
          <div class="toolbar-sep"></div>
          <div class="filter-chips">
            <button class="filter-chip active">All</button>
            <button class="filter-chip">Application</button>
            <button class="filter-chip">48hr Window</button>
            <button class="filter-chip">Claimed</button>
            <button class="filter-chip">Recovery</button>
          </div>
        </div>
        <div id="canvas-container">
          <svg id="canvas"></svg>
          <div id="zoom-controls">
            <button class="zoom-btn" id="zoom-in">+</button>
            <button class="zoom-btn" id="zoom-out">−</button>
            <button class="zoom-btn" id="zoom-fit">⟳</button>
          </div>
          <div id="stats">
            <div class="stat"><div class="stat-value" id="stat-modules">5</div><div class="stat-label">Modules</div></div>
            <div class="stat"><div class="stat-value" id="stat-seqs">15</div><div class="stat-label">Sequences</div></div>
            <div class="stat"><div class="stat-value" id="stat-msgs">35</div><div class="stat-label">Messages</div></div>
            <div class="stat"><div class="stat-value" id="stat-health">85%</div><div class="stat-label">Health</div></div>
          </div>
        </div>
      </section>

      <!-- Detail Panel -->
      <aside id="detail-panel" class="collapsed">
        <div id="detail-header">
          <div>
            <h2 id="detail-title">Details</h2>
            <div class="subtitle" id="detail-subtitle"></div>
          </div>
          <button class="close-btn" onclick="closeDetail()">×</button>
        </div>
        <div id="detail-content"></div>
      </aside>
    </main>
  </div>

  <!-- Command Palette -->
  <div id="cmd-overlay" onclick="closeCmdPalette(event)">
    <div id="cmd-palette" onclick="event.stopPropagation()">
      <div id="cmd-input-wrap">
        <input type="text" id="cmd-input" placeholder="Search modules, sequences, or type a command..." autofocus />
      </div>
      <div id="cmd-results"></div>
      <div id="cmd-footer">
        <span><kbd>↑↓</kbd> Navigate</span>
        <span><kbd>↵</kbd> Select</span>
        <span><kbd>esc</kbd> Close</span>
      </div>
    </div>
  </div>

  <!-- AI Panel -->
  <button id="ai-toggle" onclick="toggleAI()">💬</button>
  <div id="ai-panel">
    <div id="ai-header">
      <h3>🤖 AI Assistant</h3>
      <button class="close-btn" onclick="toggleAI()">×</button>
    </div>
    <div id="ai-messages">
      <div class="ai-msg bot">
        <div class="ai-msg-bubble">
          Ask me anything about this system. I'll answer based on actual module data, not guesses.
          <div class="ai-quick-links">
            <span class="ai-quick-link" onclick="askAI('What happens if someone misses the 48hr window?')">48hr window expiry</span>
            <span class="ai-quick-link" onclick="askAI('Which sequences send SMS?')">SMS sequences</span>
            <span class="ai-quick-link" onclick="askAI('What is missing documentation?')">Doc gaps</span>
          </div>
        </div>
      </div>
    </div>
    <div id="ai-input-wrap">
      <input type="text" id="ai-input" placeholder="Ask a question..." />
      <button id="ai-send" onclick="sendAI()">Send</button>
    </div>
  </div>

  <!-- Keyboard Hint -->
  <div id="keyboard-hint">
    <span><kbd>j</kbd><kbd>k</kbd> Navigate</span>
    <span><kbd>o</kbd> Open</span>
    <span><kbd>⌘K</kbd> Search</span>
    <span><kbd>?</kbd> Shortcuts</span>
  </div>

  <script>
    // ===================== DATA =====================
    const DATA = {
      modules: [
        {
          id: "LC", name: "Lead Capture", icon: "📍", color: "#3b82f6", health: 92,
          desc: "Application forms, initial tagging, lead routing",
          sequences: [
            { id: "A1", name: "Application Received", trigger: "Form Submit", msgs: 2 },
            { id: "A2", name: "Application Review", trigger: "24hr No Decision", msgs: 1 },
            { id: "A3", name: "More Info Needed", trigger: "Incomplete App", msgs: 1 }
          ]
        },
        {
          id: "AP", name: "Application Processing", icon: "📋", color: "#8b5cf6", health: 78,
          desc: "Review queue, acceptance/rejection triggers",
          sequences: [
            { id: "B1", name: "Acceptance Notification", trigger: "Approved", msgs: 2 },
            { id: "B2", name: "Welcome + Next Steps", trigger: "1hr Post-Accept", msgs: 1 }
          ]
        },
        {
          id: "48", name: "48-Hour Window", icon: "⏰", color: "#ef4444", health: 95,
          desc: "Time-limited claim window with urgency messaging",
          sequences: [
            { id: "W1", name: "Window Started", trigger: "Acceptance", msgs: 2 },
            { id: "W2", name: "24hr Reminder", trigger: "24hr Mark", msgs: 2 },
            { id: "W3", name: "6hr Warning", trigger: "42hr Mark", msgs: 2 },
            { id: "W4", name: "1hr Final", trigger: "47hr Mark", msgs: 2 },
            { id: "W5", name: "15min Countdown", trigger: "47hr45min", msgs: 1 }
          ]
        },
        {
          id: "CL", name: "Claim & Onboarding", icon: "🎉", color: "#22c55e", health: 88,
          desc: "Claim completion, welcome, customer setup",
          sequences: [
            { id: "C1", name: "Claim Confirmed", trigger: "Payment", msgs: 2 },
            { id: "C2", name: "Onboarding Start", trigger: "1hr Post-Claim", msgs: 1 },
            { id: "C3", name: "Day 1 Check-in", trigger: "24hr Post-Claim", msgs: 1 }
          ]
        },
        {
          id: "RV", name: "Recovery", icon: "🔄", color: "#f59e0b", health: 72,
          desc: "Window expiry re-engagement paths",
          sequences: [
            { id: "R1", name: "Window Expired", trigger: "48hr No Claim", msgs: 1 },
            { id: "R2", name: "Re-engagement", trigger: "3 Days Post", msgs: 1 },
            { id: "R3", name: "Waitlist Offer", trigger: "7 Days Post", msgs: 1 },
            { id: "R4", name: "Final Re-engagement", trigger: "14 Days Post", msgs: 1 }
          ]
        }
      ],
      messages: {
        "W1": [
          { id: "W1-1", timing: "0min", channel: "email", subject: "You're in - 48 hours starts NOW", content: "{{first_name}},\\n\\nYou're accepted.\\n\\nYour 48-hour window to claim your spot starts right now.\\n\\nDeadline: {{window_end_timestamp}}" },
          { id: "W1-2", timing: "0min", channel: "sms", content: "{{first_name}} - You're accepted! 48hr window starts NOW. Claim by {{window_end_short}}. Link in your email. - Jake" }
        ],
        "W2": [
          { id: "W2-1", timing: "24hr", channel: "email", subject: "24 hours left - halfway point", content: "{{first_name}},\\n\\n24 hours down. 24 hours to go.\\n\\nYour window closes {{window_end_timestamp}}." },
          { id: "W2-2", timing: "24hr", channel: "sms", content: "{{first_name}} - 24 hours left on your window. Halfway point. Reply if you have questions. - Jake" }
        ],
        "W3": [
          { id: "W3-1", timing: "42hr", channel: "email", subject: "6 hours left - this is real", content: "{{first_name}},\\n\\n6 hours left.\\n\\nI'm not going to extend your window. I'm not going to make an exception..." },
          { id: "W3-2", timing: "42hr", channel: "sms", content: "6 hours left {{first_name}}. Window closes {{window_end_short}}. Last chance to think. Then decide. - Jake" }
        ],
        "W4": [
          { id: "W4-1", timing: "47hr", channel: "email", subject: "1 hour - final call", content: "{{first_name}},\\n\\n1 hour.\\n\\nYour window closes at {{window_end_timestamp}}.\\n\\nIf you want this, claim it now." },
          { id: "W4-2", timing: "47hr", channel: "sms", content: "1 HOUR LEFT {{first_name}}. Closes {{window_end_short}}. Now or never: {{claim_link}}" }
        ],
        "W5": [
          { id: "W5-1", timing: "47hr45min", channel: "sms", content: "15 MINUTES. Window closes at {{window_end_short}}. Last chance: {{claim_link}} - Jake" }
        ],
        "C1": [
          { id: "C1-1", timing: "0min", channel: "email", subject: "You're in - let's go", content: "{{first_name}},\\n\\nYou did it. You're in.\\n\\nI'm excited to work with you..." },
          { id: "C1-2", timing: "0min", channel: "sms", content: "YOU'RE IN {{first_name}}! Check your email for login details. Let's go. - Jake" }
        ]
      }
    };

    // ===================== STATE =====================
    let state = {
      view: 'canvas',
      selectedModule: null,
      selectedSequence: null,
      focusedIndex: -1,
      cmdOpen: false,
      cmdSelected: 0,
      aiOpen: false
    };

    // ===================== HELPERS =====================
    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }

    function healthClass(h) {
      return h >= 85 ? 'high' : h >= 70 ? 'medium' : 'low';
    }

    function updateBreadcrumbs(path) {
      const bc = $('#bc-current');
      bc.textContent = path;
    }

    // ===================== SIDEBAR =====================
    function renderSidebar() {
      const list = $('#module-list');
      list.innerHTML = DATA.modules.map((mod, i) => \`
        <div class="module-item" data-mod-id="\${mod.id}">
          <div class="module-row" tabindex="0" onclick="selectModule('\${mod.id}')" data-idx="\${i}">
            <span class="module-expand">›</span>
            <span class="module-icon" style="background:\${mod.color}22;color:\${mod.color}">\${mod.icon}</span>
            <div class="module-info">
              <div class="module-name">\${mod.name}</div>
              <div class="module-meta">\${mod.sequences.length} sequences</div>
            </div>
            <div class="health-bar">
              <div class="health-fill \${healthClass(mod.health)}" style="width:\${mod.health}%"></div>
            </div>
          </div>
          <div class="module-children">
            \${mod.sequences.map(seq => \`
              <div class="child-item" data-seq-id="\${seq.id}" onclick="event.stopPropagation();selectSequence('\${mod.id}','\${seq.id}')">
                <span class="child-type">\${seq.id}</span>
                <span class="child-name">\${seq.name}</span>
                <span class="child-indicator \${DATA.messages[seq.id] ? 'doc' : 'no-doc'}"></span>
              </div>
            \`).join('')}
          </div>
        </div>
      \`).join('');
    }

    function selectModule(modId) {
      const mod = DATA.modules.find(m => m.id === modId);
      if (!mod) return;

      state.selectedModule = mod;
      state.selectedSequence = null;

      // Toggle expansion
      const item = $(\`[data-mod-id="\${modId}"]\`);
      item.classList.toggle('expanded');

      // Update selection state
      $$('.module-row').forEach(r => r.classList.remove('selected'));
      item.querySelector('.module-row').classList.add('selected');

      // Update breadcrumbs
      updateBreadcrumbs(mod.name);

      // Show detail panel
      renderModuleDetail(mod);
      $('#detail-panel').classList.remove('collapsed');
    }

    function selectSequence(modId, seqId) {
      const mod = DATA.modules.find(m => m.id === modId);
      const seq = mod?.sequences.find(s => s.id === seqId);
      if (!seq) return;

      state.selectedModule = mod;
      state.selectedSequence = seq;

      $$('.child-item').forEach(c => c.classList.remove('selected'));
      $(\`[data-seq-id="\${seqId}"]\`)?.classList.add('selected');

      updateBreadcrumbs(\`\${mod.name} / \${seq.id}\`);

      renderSequenceDetail(mod, seq);
      $('#detail-panel').classList.remove('collapsed');
    }

    // ===================== DETAIL PANEL =====================
    function renderModuleDetail(mod) {
      $('#detail-title').textContent = mod.name;
      $('#detail-subtitle').textContent = \`\${mod.id} · \${mod.sequences.length} sequences · \${mod.health}% health\`;

      $('#detail-content').innerHTML = \`
        <div class="detail-section">
          <h4>📝 Description</h4>
          <div class="field-group">
            <textarea class="editable" rows="2" onblur="saveModuleDesc('\${mod.id}', this.value)">\${mod.desc}</textarea>
          </div>
        </div>

        <div class="detail-section">
          <h4>📊 Health Score</h4>
          <div class="field-group">
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="health-bar" style="width:100px;height:8px;">
                <div class="health-fill \${healthClass(mod.health)}" style="width:\${mod.health}%"></div>
              </div>
              <span class="field-value" style="color:\${mod.health >= 85 ? 'var(--accent)' : mod.health >= 70 ? 'var(--amber)' : 'var(--red)'}">\${mod.health}%</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>📋 Sequences (\${mod.sequences.length})</h4>
          \${mod.sequences.map(seq => \`
            <div class="msg-card" onclick="selectSequence('\${mod.id}','\${seq.id}')">
              <div class="msg-header">
                <span class="msg-id">\${seq.id}</span>
                <div class="msg-badges">
                  <span class="msg-badge timing">\${seq.trigger}</span>
                </div>
              </div>
              <div class="msg-preview" style="color:var(--text-0);font-weight:500;">\${seq.name}</div>
              <div class="msg-preview">\${seq.msgs} messages</div>
            </div>
          \`).join('')}
        </div>

        <div class="detail-section">
          <h4>🔗 Linked SOPs</h4>
          <div class="link-list">
            <div class="link-pill"><span class="icon">📄</span> \${mod.name} Overview</div>
            <button class="add-link">+ Link SOP</button>
          </div>
        </div>
      \`;
    }

    function renderSequenceDetail(mod, seq) {
      const msgs = DATA.messages[seq.id] || [];

      $('#detail-title').textContent = \`\${seq.id}: \${seq.name}\`;
      $('#detail-subtitle').textContent = \`\${mod.name} · \${seq.trigger} · \${msgs.length} messages\`;

      $('#detail-content').innerHTML = \`
        <div class="detail-section">
          <h4>⚡ Trigger</h4>
          <div class="field-group">
            <div class="field-value editable" contenteditable="true">\${seq.trigger}</div>
          </div>
        </div>

        <div class="detail-section">
          <h4>💬 Messages (\${msgs.length})</h4>
          \${msgs.length ? msgs.map(msg => \`
            <div class="msg-card \${msg.channel}">
              <div class="msg-header">
                <span class="msg-id">\${msg.id}</span>
                <div class="msg-badges">
                  <span class="msg-badge timing">\${msg.timing}</span>
                  <span class="msg-badge \${msg.channel}">\${msg.channel.toUpperCase()}</span>
                </div>
              </div>
              \${msg.subject ? \`<div class="msg-subject">\${msg.subject}</div>\` : ''}
              <div class="msg-preview">\${msg.content.substring(0, 120)}...</div>
            </div>
          \`).join('') : '<p style="color:var(--text-3);font-size:12px;">No messages yet. Click + to add.</p>'}
          <button class="add-link" style="width:100%;margin-top:8px;">+ Add Message</button>
        </div>

        <div class="detail-section">
          <h4>🔗 Links</h4>
          <div class="link-list">
            <div class="link-pill"><span class="icon">⚙️</span> Workflow: \${mod.id}-\${seq.id}</div>
            <button class="add-link">+ Add Link</button>
          </div>
        </div>
      \`;
    }

    function closeDetail() {
      $('#detail-panel').classList.add('collapsed');
      updateBreadcrumbs('All Modules');
    }

    function saveModuleDesc(modId, value) {
      const mod = DATA.modules.find(m => m.id === modId);
      if (mod) mod.desc = value;
    }

    // ===================== CANVAS =====================
    function drawCanvas() {
      const svg = d3.select('#canvas');
      const container = document.getElementById('canvas-container');
      const width = container.clientWidth;
      const height = container.clientHeight;
      svg.attr('viewBox', \`0 0 \${width} \${height}\`);
      svg.selectAll('*').remove();

      const g = svg.append('g');
      const zoom = d3.zoom()
        .scaleExtent([0.3, 2])
        .on('zoom', e => g.attr('transform', e.transform));
      svg.call(zoom);

      const moduleWidth = 220;
      const moduleGap = 50;
      const startX = 50;
      const startY = 30;

      DATA.modules.forEach((mod, i) => {
        const x = startX + i * (moduleWidth + moduleGap);
        const seqH = mod.sequences.length * 48 + 70;

        // Module background
        g.append('rect')
          .attr('x', x)
          .attr('y', startY)
          .attr('width', moduleWidth)
          .attr('height', seqH)
          .attr('rx', 12)
          .attr('fill', mod.color + '08')
          .attr('stroke', mod.color + '40')
          .attr('stroke-width', 1.5);

        // Header bar
        g.append('rect')
          .attr('x', x)
          .attr('y', startY)
          .attr('width', moduleWidth)
          .attr('height', 44)
          .attr('rx', 12)
          .attr('fill', mod.color + '15');

        // Module name
        g.append('text')
          .attr('x', x + 14)
          .attr('y', startY + 26)
          .attr('fill', mod.color)
          .attr('font-size', '13px')
          .attr('font-weight', '600')
          .text(mod.name);

        // Health indicator
        g.append('rect')
          .attr('x', x + moduleWidth - 50)
          .attr('y', startY + 14)
          .attr('width', 36)
          .attr('height', 18)
          .attr('rx', 9)
          .attr('fill', healthClass(mod.health) === 'high' ? '#22c55e22' : healthClass(mod.health) === 'medium' ? '#f59e0b22' : '#ef444422');

        g.append('text')
          .attr('x', x + moduleWidth - 32)
          .attr('y', startY + 26)
          .attr('fill', healthClass(mod.health) === 'high' ? '#4ade80' : healthClass(mod.health) === 'medium' ? '#fbbf24' : '#f87171')
          .attr('font-size', '10px')
          .attr('font-weight', '600')
          .attr('text-anchor', 'middle')
          .text(mod.health + '%');

        // Sequences
        mod.sequences.forEach((seq, j) => {
          const sy = startY + 54 + j * 48;

          g.append('rect')
            .attr('x', x + 10)
            .attr('y', sy)
            .attr('width', moduleWidth - 20)
            .attr('height', 40)
            .attr('rx', 8)
            .attr('fill', '#1f1f23')
            .attr('stroke', '#27272a')
            .style('cursor', 'pointer')
            .on('click', () => selectSequence(mod.id, seq.id))
            .on('mouseover', function() { d3.select(this).attr('stroke', mod.color); })
            .on('mouseout', function() { d3.select(this).attr('stroke', '#27272a'); });

          g.append('text')
            .attr('x', x + 22)
            .attr('y', sy + 16)
            .attr('fill', mod.color)
            .attr('font-size', '10px')
            .attr('font-weight', '700')
            .style('pointer-events', 'none')
            .text(seq.id);

          g.append('text')
            .attr('x', x + 22)
            .attr('y', sy + 30)
            .attr('fill', '#fafafa')
            .attr('font-size', '11px')
            .style('pointer-events', 'none')
            .text(seq.name.length > 22 ? seq.name.substring(0, 22) + '...' : seq.name);

          // Message count
          g.append('text')
            .attr('x', x + moduleWidth - 26)
            .attr('y', sy + 24)
            .attr('fill', '#52525b')
            .attr('font-size', '10px')
            .attr('text-anchor', 'middle')
            .style('pointer-events', 'none')
            .text(seq.msgs);
        });
      });

      // Zoom controls
      document.getElementById('zoom-in').onclick = () => svg.transition().call(zoom.scaleBy, 1.4);
      document.getElementById('zoom-out').onclick = () => svg.transition().call(zoom.scaleBy, 0.7);
      document.getElementById('zoom-fit').onclick = () => svg.transition().call(zoom.transform, d3.zoomIdentity);

      // Update stats
      const totalSeqs = DATA.modules.reduce((a, m) => a + m.sequences.length, 0);
      const totalMsgs = DATA.modules.reduce((a, m) => a + m.sequences.reduce((b, s) => b + s.msgs, 0), 0);
      const avgHealth = Math.round(DATA.modules.reduce((a, m) => a + m.health, 0) / DATA.modules.length);
      $('#stat-modules').textContent = DATA.modules.length;
      $('#stat-seqs').textContent = totalSeqs;
      $('#stat-msgs').textContent = totalMsgs;
      $('#stat-health').textContent = avgHealth + '%';
    }

    // ===================== COMMAND PALETTE =====================
    function openCmdPalette() {
      state.cmdOpen = true;
      state.cmdSelected = 0;
      $('#cmd-overlay').classList.add('visible');
      $('#cmd-input').value = '';
      $('#cmd-input').focus();
      renderCmdResults('');
    }

    function closeCmdPalette(e) {
      if (e && e.target !== $('#cmd-overlay')) return;
      state.cmdOpen = false;
      $('#cmd-overlay').classList.remove('visible');
    }

    function renderCmdResults(query) {
      const results = $('#cmd-results');
      const q = query.toLowerCase();

      // Build searchable items
      const items = [];

      // Modules
      DATA.modules.forEach(mod => {
        if (!q || mod.name.toLowerCase().includes(q) || mod.id.toLowerCase().includes(q)) {
          items.push({ type: 'module', label: mod.name, meta: \`\${mod.id} · \${mod.sequences.length} seqs\`, icon: mod.icon, color: mod.color, action: () => selectModule(mod.id) });
        }
        // Sequences
        mod.sequences.forEach(seq => {
          if (!q || seq.name.toLowerCase().includes(q) || seq.id.toLowerCase().includes(q)) {
            items.push({ type: 'sequence', label: \`\${seq.id}: \${seq.name}\`, meta: mod.name, icon: '📋', color: mod.color, action: () => selectSequence(mod.id, seq.id) });
          }
        });
      });

      // Commands
      const commands = [
        { label: 'New Module', meta: 'Create a new module', icon: '➕', shortcut: '⌘N', action: () => console.log('new module') },
        { label: 'Deploy to GHL', meta: 'Push changes to GoHighLevel', icon: '🚀', shortcut: '⌘⇧D', action: () => console.log('deploy') },
        { label: 'Export JSON', meta: 'Download system data', icon: '📤', action: () => console.log('export') }
      ];

      if (!q || 'new module'.includes(q)) items.push({ ...commands[0], type: 'command' });
      if (!q || 'deploy'.includes(q)) items.push({ ...commands[1], type: 'command' });
      if (!q || 'export'.includes(q)) items.push({ ...commands[2], type: 'command' });

      // Group by type
      const modules = items.filter(i => i.type === 'module');
      const sequences = items.filter(i => i.type === 'sequence');
      const cmds = items.filter(i => i.type === 'command');

      let html = '';
      if (modules.length) {
        html += \`<div class="cmd-group"><div class="cmd-group-label">Modules</div>\${modules.map((it, i) => renderCmdItem(it, i)).join('')}</div>\`;
      }
      if (sequences.length) {
        const offset = modules.length;
        html += \`<div class="cmd-group"><div class="cmd-group-label">Sequences</div>\${sequences.map((it, i) => renderCmdItem(it, offset + i)).join('')}</div>\`;
      }
      if (cmds.length) {
        const offset = modules.length + sequences.length;
        html += \`<div class="cmd-group"><div class="cmd-group-label">Commands</div>\${cmds.map((it, i) => renderCmdItem(it, offset + i)).join('')}</div>\`;
      }

      results.innerHTML = html || '<div style="padding:20px;text-align:center;color:var(--text-3);">No results</div>';

      // Store items for navigation
      window._cmdItems = [...modules, ...sequences, ...cmds];
    }

    function renderCmdItem(item, index) {
      const selected = index === state.cmdSelected ? 'selected' : '';
      return \`
        <div class="cmd-item \${selected}" data-idx="\${index}" onclick="executeCmdItem(\${index})">
          <span class="icon" style="background:\${item.color || 'var(--bg-3)'}22;color:\${item.color || 'var(--text-1)'}">\${item.icon}</span>
          <span class="label">\${item.label}</span>
          <span class="meta">\${item.meta}</span>
          \${item.shortcut ? \`<span class="shortcut">\${item.shortcut}</span>\` : ''}
        </div>
      \`;
    }

    function executeCmdItem(index) {
      const item = window._cmdItems?.[index];
      if (item?.action) {
        item.action();
        closeCmdPalette({target: $('#cmd-overlay')});
      }
    }

    // ===================== AI ASSISTANT =====================
    function toggleAI() {
      state.aiOpen = !state.aiOpen;
      $('#ai-panel').classList.toggle('visible', state.aiOpen);
      $('#ai-toggle').classList.toggle('hidden', state.aiOpen);
      if (state.aiOpen) $('#ai-input').focus();
    }

    function askAI(question) {
      $('#ai-input').value = question;
      sendAI();
    }

    function sendAI() {
      const input = $('#ai-input');
      const msg = input.value.trim();
      if (!msg) return;

      const messages = $('#ai-messages');
      messages.innerHTML += \`<div class="ai-msg user"><div class="ai-msg-bubble">\${msg}</div></div>\`;

      setTimeout(() => {
        let response = '';
        const lc = msg.toLowerCase();

        if (lc.includes('48') || lc.includes('window') || lc.includes('miss')) {
          response = \`According to the <b>48-Hour Window</b> module (95% health):<br><br>
            When window expires without claim:<br>
            1. Workflow 48-04 fires<br>
            2. Contact moves to Lost stage<br>
            3. Tag "window-expired" added<br>
            4. Starts sequence R1 (Recovery)<br><br>
            Re-engagement attempts at 3d, 7d, and 14d post-expiry.\`;
        } else if (lc.includes('sms') || lc.includes('text')) {
          response = \`Sequences that send SMS messages:<br><br>
            <b>W1</b> - Window Started (1 SMS)<br>
            <b>W2</b> - 24hr Reminder (1 SMS)<br>
            <b>W3</b> - 6hr Warning (1 SMS)<br>
            <b>W4</b> - 1hr Final (1 SMS)<br>
            <b>W5</b> - 15min Countdown (1 SMS)<br>
            <b>C1</b> - Claim Confirmed (1 SMS)<br><br>
            Total: 6 SMS messages across 6 sequences.\`;
        } else if (lc.includes('missing') || lc.includes('doc') || lc.includes('gap')) {
          response = \`Documentation gaps detected:<br><br>
            <b>Low health modules:</b><br>
            • Recovery: 72% (missing SOPs)<br>
            • Application Processing: 78%<br><br>
            <b>Sequences without messages:</b><br>
            • A2, A3 (Lead Capture)<br>
            • R2, R3, R4 (Recovery)<br><br>
            Priority: Add recovery re-engagement content.\`;
        } else {
          response = \`I can answer questions about the Burton Method system based on actual data.<br><br>
            Try asking about:<br>
            • Specific workflows or triggers<br>
            • What happens at certain stages<br>
            • Documentation gaps<br>
            • Message sequences\`;
        }

        messages.innerHTML += \`<div class="ai-msg bot"><div class="ai-msg-bubble">\${response}</div></div>\`;
        messages.scrollTop = messages.scrollHeight;
      }, 400);

      input.value = '';
    }

    // ===================== KEYBOARD SHORTCUTS =====================
    document.addEventListener('keydown', e => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (state.cmdOpen) closeCmdPalette({target: $('#cmd-overlay')});
        else openCmdPalette();
        return;
      }

      // Escape
      if (e.key === 'Escape') {
        if (state.cmdOpen) closeCmdPalette({target: $('#cmd-overlay')});
        else if (state.aiOpen) toggleAI();
        else closeDetail();
        return;
      }

      // Command palette navigation
      if (state.cmdOpen) {
        const items = window._cmdItems || [];
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          state.cmdSelected = (state.cmdSelected + 1) % items.length;
          $$('.cmd-item').forEach((el, i) => el.classList.toggle('selected', i === state.cmdSelected));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          state.cmdSelected = (state.cmdSelected - 1 + items.length) % items.length;
          $$('.cmd-item').forEach((el, i) => el.classList.toggle('selected', i === state.cmdSelected));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          executeCmdItem(state.cmdSelected);
        }
        return;
      }

      // AI input
      if (state.aiOpen && document.activeElement === $('#ai-input')) {
        if (e.key === 'Enter') sendAI();
        return;
      }

      // Module navigation (j/k)
      if (e.key === 'j' || e.key === 'k') {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        e.preventDefault();
        const rows = Array.from($$('.module-row'));
        if (!rows.length) return;

        let idx = rows.findIndex(r => r.classList.contains('focused'));
        if (idx === -1) idx = 0;
        else {
          rows[idx].classList.remove('focused');
          idx = e.key === 'j' ? (idx + 1) % rows.length : (idx - 1 + rows.length) % rows.length;
        }
        rows[idx].classList.add('focused');
        rows[idx].scrollIntoView({ block: 'nearest' });

        // Show keyboard hint
        $('#keyboard-hint').classList.add('visible');
        clearTimeout(window._hintTimeout);
        window._hintTimeout = setTimeout(() => $('#keyboard-hint').classList.remove('visible'), 2000);
      }

      // Open focused module
      if (e.key === 'o' || e.key === 'Enter') {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        const focused = $('.module-row.focused');
        if (focused) {
          focused.click();
        }
      }
    });

    // Command palette input handler
    $('#cmd-input').addEventListener('input', e => {
      state.cmdSelected = 0;
      renderCmdResults(e.target.value);
    });

    // ===================== INIT =====================
    function goHome() {
      closeDetail();
      $$('.module-row').forEach(r => r.classList.remove('selected'));
      $$('.child-item').forEach(c => c.classList.remove('selected'));
      state.selectedModule = null;
      state.selectedSequence = null;
    }

    function init() {
      renderSidebar();
      drawCanvas();

      // Resize handler
      window.addEventListener('resize', () => {
        drawCanvas();
      });
    }

    init();
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
