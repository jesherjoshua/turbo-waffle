// Send a message to the background script to indicate that the page has fully loaded
window.addEventListener('load', () => {
  chrome.runtime.sendMessage({ action: 'PageFullyLoaded' });
  removeElementsBasedOnUserRules();
});

let hoverEnabled = false;

// Listen for messages from the popup.js script
let highlightedElement = '';

// Function to handle mouse hover
function handleMouseHover(event) {
  event.target.style.border = '2px solid red';
}

// Function to handle mouse leave
function handleMouseLeave(event) {
  event.target.style.border = '';
}

// Function to handle click
function handleClick(event) {
  highlightedElement = event.target;
  console.log('Element clicked', event.target);

  // Remove 'highlighted' class from all previously highlighted elements
  const previouslyHighlightedElements = document.querySelectorAll('.highlighted');
  previouslyHighlightedElements.forEach(function (element) {
    element.classList.remove('highlighted');
  });

  // Add 'highlighted' class to the clicked element
  highlightedElement.classList.add('highlighted');
  updateDialogBox();
}

// Function to remove elements based on user rules
function removeElementsBasedOnUserRules() {
  chrome.storage.local.get('user_rules', function (data) {
    console.log('Removing User rules:', data.user_rules);
    const userRules = data.user_rules || [];
    userRules.forEach(function (userRule) {
      const parts = userRule.split('##');
      const hostname = parts[0];
      const selector = parts[1];

      // Check if the current hostname matches the stored hostname
      if (window.location.hostname === hostname) {
        // Find the elements matching the stored selector and remove them
        const elementsToRemove = document.querySelectorAll(selector);
        elementsToRemove.forEach(function (element) {
          element.remove();
        });
      }
    });
  });
}

// Function to hide an element
function hideElement(element) {
  element.style.display = 'none';
}

function blockElement() {
  // Check if the highlighted element has a class name
  if (highlightedElement.className) {
    // Use the class name as a selector to hide the element
    const elementsToHide = document.querySelectorAll('.' + highlightedElement.className);

    elementsToHide.forEach(function (element) {
      hideElement(element);
    });
  } else {
    // Handle scenarios where the element doesn't have a class name
    // You can use other attributes or properties to identify and hide the element
    // For example, you can use the id attribute or other unique properties
    const elementToHide = document.getElementById(highlightedElement.id);
    hideElement(elementToHide);
  }

  // Store the user rule in Chrome storage
  const userRule = window.location.hostname + '##' + highlightedElement.tagName + highlightedElement.className.replace('highlighted', '') + highlightedElement.id;
  chrome.storage.local.get('user_rules', function (data) {
    const userRules = data.user_rules || [];
    userRules.push(userRule);
    console.log('User rules:', userRules);
    chrome.storage.local.set({ 'user_rules': userRules }, function () {
      console.log('User rule stored:', userRule);
    });
  });
}


function createDialogBox() {
  const dialogBox = document.createElement('div');
  dialogBox.id = 'dialogBox';
  dialogBox.style.position = 'fixed';
  dialogBox.style.top = '0%';
  dialogBox.style.right = '0%';
  // dialogBox.style.transform = 'translate(-50%, -50%)';
  dialogBox.style.backgroundColor = 'white';
  dialogBox.style.padding = '10px';
  dialogBox.style.margin = '10px';
  dialogBox.style.border = '1px solid black';
  dialogBox.style.zIndex = '9999';


  const title = document.createElement('h2');
  title.textContent = 'Highlighted Elements';

  const list = document.createElement('ul');

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Confirm';
  confirmButton.className = 'confirm-button';
  confirmButton.onclick = blockElement

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.className = 'close-button';

  closeButton.onclick = function () {
    console.log('closing');
    untoggleHover();
  };

  dialogBox.appendChild(title);
  dialogBox.appendChild(list);
  dialogBox.appendChild(confirmButton);
  dialogBox.appendChild(closeButton);

  dialogBox.addEventListener('mouseover', (event) => {
    event.stopImmediatePropagation();
  });
  dialogBox.addEventListener('mouseout', (event) => {
    event.stopImmediatePropagation();
  });
  dialogBox.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
  })

  document.body.appendChild(dialogBox);

  updateDialogBox();
}

function updateDialogBox() {
  console.log(highlightedElement);
  const dialogBox = document.getElementById('dialogBox');
  const list = dialogBox.querySelector('ul');
  list.innerHTML = '';

  const listItem = document.createElement('li');
  listItem.textContent = window.location.hostname + '##' + highlightedElement.tagName + highlightedElement.className.replace('highlighted', '') + highlightedElement.id;
  list.appendChild(listItem);
}

function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  console.log('elements', elements, className);
  elements[0].style.display = 'none';
}

// Listen for messages from the popup.js script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Message received', message);
  if (message.action === 'toggleHover') {
    document.addEventListener('mouseover', handleMouseHover);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('click', handleClick);
    createDialogBox();
  } else if (message.action === 'untoggleHover') {
    untoggleHover();
  }
});

// Function to hide an element
function untoggleHover() {
  document.removeEventListener('mouseover', handleMouseHover);
  document.removeEventListener('mouseout', handleMouseLeave);
  document.removeEventListener('click', handleClick);
  const dialogBox = document.getElementById('dialogBox');
  if (dialogBox) {
    dialogBox.remove();
  }
}
