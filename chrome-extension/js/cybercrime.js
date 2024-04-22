// Chat functionality
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatInput.value;
  if (message.trim() !== '') {
    displayMessage(message, 'user');
    chatInput.value = '';
    // Process the message and send a response
    simulateChatResponse(message);
  }
});

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(sender);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateChatResponse(message) {
  // Simulate a response from the department
  const response = `Thank you for your message: "${message}". We will get back to you soon.`;
  setTimeout(() => {
    displayMessage(response, 'department');
  }, 500);
}
