if (window.location.href.includes('/watch/')) {
  chrome.runtime.sendMessage({ action: 'createWatchParty' });
}
// ...

function onPlayPause(event) {
  // Send a play/pause message to other users in the watch party
  chrome.runtime.sendMessage({ action: 'send', watchPartyId, data: { type: 'playPause', value: event.type === 'playing' } });
}

function onSeeked(event) {
  // Send a seeked message to other users in the watch party
  const currentTime = event.target.currentTime;
  chrome.runtime.sendMessage({ action: 'send', watchPartyId, data: { type: 'seeked', value: currentTime } });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages from the background script

  if (message.type === 'playPause') {
    // Synchronize play/pause state
    if (message.value) {
      video.play();
    } else {
      video.pause();
    }
  } else if (message.type === 'seeked') {
    //
    // Synchronize seeked position
    video.currentTime = message.value;
  }
});

// Function to find the video element on the Netflix page
function findVideoElement() {
  return document.querySelector('video');
}

// Function to add event listeners for video element
function addVideoEventListeners(video) {
  video.addEventListener('playing', onPlayPause);
  video.addEventListener('pause', onPlayPause);
  video.addEventListener('seeked', onSeeked);
}

// Function to remove event listeners for video element
function removeVideoEventListeners(video) {
  video.removeEventListener('playing', onPlayPause);
  video.removeEventListener('pause', onPlayPause);
  video.removeEventListener('seeked', onSeeked);
}

// Find the video element and add event listeners
const video = findVideoElement();
if (video) {
  addVideoEventListeners(video);
}
