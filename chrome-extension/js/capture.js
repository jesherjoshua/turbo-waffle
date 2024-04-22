chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureFullPageScreenshot') {
    scrollThroughPage().then(() => {
      toggleGoogleAds(true);
      adjustStyles(true);
      html2canvas(document.body, { useCORS: true, scrollY: 0 }).then((canvas) => {
        adjustStyles(false);
        toggleGoogleAds(false);
        const imgData = canvas.toDataURL('image/png');
        // downloadImage(imgData);
        sendResponse({ imgData });
      });
    });
    return true;
  } else if (request.action === 'getFullHtml') {
    sendResponse({ fullHtml: document.documentElement.outerHTML });
  }
  else if (request.action === 'takeScreenshot') {
    chrome.tabs.captureVisibleTab().then((imgData) => {
      console.log("Screenshot capture.js", imgData);
      sendResponse({ imgData });
    })
    return true
  }
});
 
function downloadImage(dataUrl) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `screenshot_${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  chrome.runtime.sendMessage({ action: 'screenshotDownloaded' });
}

function toggleGoogleAds(shouldHide) {
  const googleAds = document.querySelectorAll('ins.adsbygoogle, iframe[id^="google_ads_iframe"]');
  for (const ad of googleAds) {
    ad.style.display = shouldHide ? 'none' : '';
  }
}

function adjustStyles(applyAdjustments) {
  const body = document.body;
  if (applyAdjustments) {
    body.style.setProperty('height', 'auto', 'important');
    body.style.setProperty('max-width', '100%', 'important');
  } else {
    body.style.removeProperty('height');
    body.style.removeProperty('max-width');
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrollThroughPage() {
  const scrollStep = window.innerHeight;
  const totalHeight = document.documentElement.scrollHeight;
  let currentScrollPosition = 0;

  while (currentScrollPosition < totalHeight) {
    window.scrollTo(0, currentScrollPosition);
    currentScrollPosition += scrollStep;
    await sleep(200);
  }

  // Scroll back to the top of the page before capturing the screenshot
  window.scrollTo(0, 0);
  await sleep(200);
}

