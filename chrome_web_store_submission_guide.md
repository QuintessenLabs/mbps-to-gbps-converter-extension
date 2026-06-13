# Chrome Web Store Submission Guide: Mbps to Gbps Converter

This document contains all the necessary text, copy, justifications, and settings required to submit the **Mbps to Gbps Converter** extension to the Chrome Web Store and ensure a quick approval.

---

## 1. Store Metadata

| Field | Value / Description | Character Limit (Used) |
| :--- | :--- | :--- |
| **Title** | `Mbps to Gbps Converter` | 23 / 45 chars |
| **Short Description** | `Automatically converts Mbps and Mb/s network speed values to Gbps in real-time on all web pages.` | 95 / 132 chars |
| **Category** | `Productivity` OR `Accessibility` | N/A |
| **Search Keywords** | `mbps to gbps, speed converter, megabits to gigabits, bandwidth converter, network speed` | 5 keywords max |

### Detailed Description (Up to 16,000 characters)
Paste the following text into the **Description** box:
```text
Tired of doing mental math to convert network speeds from Megabits (Mbps) to Gigabits (Gbps)? 

Mbps to Gbps Converter is a lightweight, real-time extension that automatically updates all bandwidth notations on the web pages you browse, making it easier to compare fast internet speeds, cloud hosting network specifications, and data center bandwidth figures.

🚀 KEY FEATURES:
• Real-time Conversions: Instantly converts Mbps and Mb/s values to Gbps (e.g., "1,200 Mbps" becomes "1.2 Gbps", "500 Mbps" becomes "0.5 Gbps").
• capitalization-preserving: Respects the original suffix case (matches Mbps -> Gbps, Mb/s -> Gb/s, mbps -> gbps).
• Dynamic SPA Support: Uses a MutationObserver to convert newly loaded network speed elements dynamically as you scroll or pages load new content.
• Option Dashboard: Check your active page conversion counts and global all-time stats in the extension popup.
• Safe Toggling: Toggling the extension on/off reloads the active tab to safely apply or revert changes without breaking page layouts.
• Ultra-Lightweight: Runs entirely on vanilla JavaScript without any external tracking libraries or heavy bundles.

🔒 PRIVACY FIRST:
• Zero tracking or data collection.
• Runs entirely locally in your browser sandbox.
• Settings and statistics are stored locally on your device using chrome.storage.local.
• No personal information is ever transmitted or shared.
```

---

## 2. Privacy & Data Disclosures

During the submission process under the **Privacy** tab, use the following answers:

### Data Collection Declaration
- **Question**: Do you collect or use user data?
- **Answer**: **No**. Declare that this extension does not collect, store, or transmit any user data.

### Single Purpose Justification
- **Question**: Explain the single purpose of your extension.
- **Answer**: 
  `This extension has a single purpose: to automatically convert Megabit-per-second (Mbps) network speed notations to Gigabit-per-second (Gbps) values on web pages, making bandwidth figures easier to read.`

### Permissions Justifications
You must explain why the extension requires its requested permissions:

1. **`storage` Permission**
   - **Justification**: 
     `Used to save the user's enable/disable state and track global conversion statistics locally. This allows configurations to persist across page refreshes and browser restarts.`
2. **Host Permissions (`http://*/*` and `https://*/*`)**
   - **Justification**: 
     `Required to inject the text-replacement script into web pages to scan and convert Mbps values to Gbps. The extension needs host permissions to parse DOM text nodes on the pages the user browses.`

---

## 3. Reviewer Instructions (Important for Quick Approval)

Paste this into the **Instructions for Reviewers** text field:
```text
Mbps to Gbps Converter replaces Megabit speed strings (Mbps/Mb/s) on web pages with their equivalent Gigabit values (Gbps/Gb/s).

To test the extension:
1. Open a web page that contains Mbps notations (for example, any speed test results page, a bandwidth article, or cloud pricing table containing speed values like '1200 Mbps' or '500 Mb/s').
2. Observe that the values are automatically converted (e.g. '1200 Mbps' is displayed as '1.2 Gbps').
3. Click the extension icon in the Chrome toolbar to open the stats popup.
4. Toggle the 'Enable Conversion' switch off. The page will reload and restore the original '1200 Mbps' text.
5. Toggle it back on, and check that it immediately converts and registers the count on the popup counter.

Technical notes:
- The extension runs entirely locally using vanilla JS.
- No network resources or third-party connections are made.
- Settings are stored locally using chrome.storage.local.
```

---

## 4. Visual Store Assets

Upload the following assets to the developer console:

### A. Extension Icons (Already Prepared)
- **16x16 px**: `icons/icon16.png`
- **48x48 px**: `icons/icon48.png`
- **128x128 px**: `icons/icon128.png`

### B. Privacy Policy URL (Required)
```text
https://github.com/QuintessenLabs/mbps-to-gbps-converter-extension/blob/main/PRIVACY_POLICY.md
```
```
