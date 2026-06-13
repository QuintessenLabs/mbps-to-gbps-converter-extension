document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabled-toggle');
  const pageConversionsEl = document.getElementById('page-conversions');
  const globalConversionsEl = document.getElementById('global-conversions');

  // 1. Sync enablement toggle and global stats from storage
  chrome.storage.local.get(['isEnabled', 'globalConversions'], (result) => {
    const isEnabled = result.isEnabled !== false;
    enabledToggle.checked = isEnabled;
    
    const globalCount = result.globalConversions || 0;
    globalConversionsEl.textContent = globalCount.toLocaleString();
  });

  // 2. Query stats from the content script running on the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) return;
    const activeTab = tabs[0];
    
    // Check if the tab is a web page we have access to
    if (!activeTab.url || (!activeTab.url.startsWith('http://') && !activeTab.url.startsWith('https://'))) {
      pageConversionsEl.textContent = '0';
      return;
    }

    // Try messaging the content script
    chrome.tabs.sendMessage(activeTab.id, { action: "getStats" }, (response) => {
      // If content script is active, display its conversion count
      if (chrome.runtime.lastError) {
        // Content script might not be injected yet (need reload)
        pageConversionsEl.textContent = '0';
        return;
      }
      
      if (response) {
        pageConversionsEl.textContent = response.count.toLocaleString();
        enabledToggle.checked = response.isEnabled;
      }
    });
  });

  // 3. Handle enablement toggling
  enabledToggle.addEventListener('change', () => {
    const isEnabled = enabledToggle.checked;
    
    // Save to storage
    chrome.storage.local.set({ isEnabled }, () => {
      // Propagate the change to the active tab to reload it
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        const activeTab = tabs[0];
        
        if (!activeTab.url || (!activeTab.url.startsWith('http://') && !activeTab.url.startsWith('https://'))) {
          return;
        }

        // Send toggle command to content script (it handles reloading itself)
        chrome.tabs.sendMessage(activeTab.id, { action: "toggleEnabled", isEnabled }, () => {
          if (chrome.runtime.lastError) {
            // Content script wasn't responding, reload the tab manually
            chrome.tabs.reload(activeTab.id);
          }
        });
      });
    });
  });
});
