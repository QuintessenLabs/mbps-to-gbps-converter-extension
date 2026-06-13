let totalConversions = 0;
let isEnabled = true;
let observer = null;

// Suffix conversion logic (Troll Mode)
function convertTextNode(node) {
  const text = node.nodeValue;
  if (!text) return 0;
  
  let matchCount = 0;
  
  const replacements = [
    { regex: /\bMegabits\b/g, rep: 'Gigabits' },
    { regex: /\bmegabits\b/g, rep: 'gigabits' },
    { regex: /\bMegabit\b/g, rep: 'Gigabit' },
    { regex: /\bmegabit\b/g, rep: 'gigabit' },
    { regex: /\bMbps\b/g, rep: 'Gbps' },
    { regex: /\bmbps\b/g, rep: 'gbps' },
    { regex: /\bMb\/s\b/g, rep: 'Gb/s' },
    { regex: /\bmb\/s\b/g, rep: 'gb/s' }
  ];
  
  let newText = text;
  for (const item of replacements) {
    if (item.regex.test(newText)) {
      item.regex.lastIndex = 0; // Reset regex index
      newText = newText.replace(item.regex, item.rep);
      matchCount++;
    }
  }
  
  if (matchCount > 0) {
    node.nodeValue = newText;
  }
  return matchCount;
}

// Safely walk only text nodes, skipping scripts and inputs
function walkTextNodes(root) {
  const iterator = document.createNodeIterator(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (
          tag === 'script' || 
          tag === 'style' || 
          tag === 'textarea' || 
          tag === 'noscript' || 
          tag === 'code' || 
          parent.isContentEditable
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let node;
  let count = 0;
  while ((node = iterator.nextNode())) {
    count += convertTextNode(node);
  }
  return count;
}

// Save tab-specific statistics to local memory and broadcast to popup
function updateStats(newConversionsCount = 0) {
  chrome.storage.local.get(['stats', 'globalConversions'], (result) => {
    const stats = result.stats || {};
    const tabId = getTabId();
    stats[tabId] = totalConversions;
    
    let globalCount = result.globalConversions || 0;
    globalCount += newConversionsCount;
    
    chrome.storage.local.set({ stats, globalConversions: globalCount });
  });
}

function getTabId() {
  // Simple heuristic for tab identification, or query from background
  // For content script context, window.location.href acts as a decent key
  return window.location.href;
}

// Initialize conversion scan
function init() {
  chrome.storage.local.get(['isEnabled'], (result) => {
    isEnabled = result.isEnabled !== false;
    
    if (!isEnabled) return;
    
    // Initial scan
    totalConversions = walkTextNodes(document.body);
    if (totalConversions > 0) {
      updateStats(totalConversions);
    }
    
    // Observer for dynamic content additions (SPAs, lazy loading)
    observer = new MutationObserver((mutations) => {
      let newConversions = 0;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            newConversions += convertTextNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            newConversions += walkTextNodes(node);
          }
        }
      }
      if (newConversions > 0) {
        totalConversions += newConversions;
        updateStats(newConversions);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Listener for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStats") {
    sendResponse({ count: totalConversions, isEnabled });
  } else if (request.action === "toggleEnabled") {
    // Save setting and schedule a reload to apply changes cleanly
    chrome.storage.local.set({ isEnabled: request.isEnabled }, () => {
      window.location.reload();
    });
  }
});

// Run once the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
