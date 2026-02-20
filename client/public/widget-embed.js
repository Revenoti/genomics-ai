(function () {
  if (window.__genomicWidgetLoaded) return;
  window.__genomicWidgetLoaded = true;

  var scriptEl = document.currentScript;
  var WIDGET_ORIGIN =
    (scriptEl && scriptEl.getAttribute('data-origin')) ||
    (scriptEl && scriptEl.src ? new URL(scriptEl.src).origin : '');

  var isOpen = false;
  var bubble, iframe, overlay;

  function createStyles() {
    var style = document.createElement('style');
    style.textContent =
      '#genomic-widget-bubble{position:fixed;bottom:24px;right:24px;z-index:999999;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#2a8a8a,#1a6b6b);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;transition:opacity 0.15s ease}' +
      '#genomic-widget-bubble:hover{opacity:0.9}' +
      '#genomic-widget-bubble svg{width:28px;height:28px}' +
      '#genomic-widget-overlay{position:fixed;bottom:96px;right:24px;z-index:999998;width:400px;height:600px;max-height:calc(100vh - 120px);max-width:calc(100vw - 32px);border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.2);opacity:0;transform:translateY(16px) scale(0.95);transition:opacity 0.25s ease,transform 0.25s ease;pointer-events:none}' +
      '#genomic-widget-overlay.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      '#genomic-widget-overlay iframe{width:100%;height:100%;border:none}' +
      '@media(max-width:480px){#genomic-widget-overlay{bottom:0;right:0;width:100vw;height:100vh;max-height:100vh;max-width:100vw;border-radius:0}#genomic-widget-bubble{bottom:16px;right:16px;width:56px;height:56px}}';
    document.head.appendChild(style);
  }

  function createBubble() {
    bubble = document.createElement('button');
    bubble.id = 'genomic-widget-bubble';
    bubble.setAttribute('aria-label', 'Open chat');
    bubble.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    bubble.onclick = toggle;
    document.body.appendChild(bubble);
  }

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'genomic-widget-overlay';
    iframe = document.createElement('iframe');
    iframe.src = WIDGET_ORIGIN + '/widget';
    iframe.title = 'Genomics AI Chat';
    iframe.allow = 'clipboard-write';
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);
  }

  function toggle() {
    isOpen = !isOpen;
    if (isOpen) {
      overlay.classList.add('open');
      bubble.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      bubble.setAttribute('aria-label', 'Close chat');
    } else {
      overlay.classList.remove('open');
      bubble.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
      bubble.setAttribute('aria-label', 'Open chat');
    }
  }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'genomic-widget-close') {
      if (isOpen) toggle();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    createStyles();
    createBubble();
    createOverlay();
  }
})();
