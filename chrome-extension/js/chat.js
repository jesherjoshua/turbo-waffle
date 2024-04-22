// Create chat board container
const chatBoardContainer = document.createElement("div");
chatBoardContainer.classList.add("chat-board", "chatbot", "chat", "new", "trending");
document.body.appendChild(chatBoardContainer);
const action = 'closeSettings'; // Replace with your desired action

// Hide or show the chatbot based on the chatbotStatus
(async () => {
    const { chatbotStatus } = await new Promise((resolve) => {
        chrome.storage.local.get(['chatbotStatus'], (result) => {
            resolve(result);
        });
    });
    console.log('chatbotStatus', chatbotStatus);
    if (chatbotStatus === false) {
        chatBoardContainer.style.display = 'none';
    } else {
        chatBoardContainer.style.display = 'block';
    }
})();

// Create frame content
const frameContent = document.createElement("div");
frameContent.classList.add("frame-content");
chatBoardContainer.appendChild(frameContent);

// Create widget position
const widgetPosition = document.createElement("div");
widgetPosition.classList.add("widget-position-right", "sidebar-position-right", "onlyBubble");
widgetPosition.id = "chatContainer";
frameContent.appendChild(widgetPosition);

// Create chat
const chat = document.createElement("div");
chat.classList.add("chat", "no-clip-path", "chrome", "moveFromRight-enter-done");
widgetPosition.appendChild(chat);

// Create chat header
const chatHeader = document.createElement("div");
chatHeader.classList.add("chat-header", "project-online");
chatHeader.style.color = "rgb(255, 255, 255)";
chatHeader.style.background = "linear-gradient(135deg, rgb(42, 39, 218) 0%, rgb(0, 204, 255) 100%)";
chat.appendChild(chatHeader);

// Create chat header content
const chatHeaderContent = document.createElement("h2");
chatHeaderContent.classList.add("oneline");
chatHeader.appendChild(chatHeaderContent);

const chatHeaderSpan = document.createElement("span");
chatHeaderSpan.textContent = "Hi there!";
chatHeaderContent.appendChild(chatHeaderSpan);

// Create minimize button
const minimizeButton = document.createElement("button");
minimizeButton.classList.add("material-icons", "exit-chat", "ripple", "tidio-1s5t5ku");
minimizeButton.id = "minimize-button";
minimizeButton.type = "button";
minimizeButton.setAttribute("aria-label", "Minimize");
minimizeButton.style.color = "rgb(255, 255, 255)";
chatHeader.appendChild(minimizeButton);

const minimizeButtonSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
minimizeButtonSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
minimizeButtonSvg.setAttribute("height", "24");
minimizeButtonSvg.setAttribute("viewBox", "0 0 24 24");
minimizeButtonSvg.setAttribute("width", "24");
minimizeButtonSvg.id = "ic-minimize";
minimizeButton.appendChild(minimizeButtonSvg);

const minimizeButtonPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
minimizeButtonPath1.setAttribute("d", "M0 0h24v24H0z");
minimizeButtonPath1.setAttribute("fill", "none");
minimizeButtonSvg.appendChild(minimizeButtonPath1);

const minimizeButtonPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
minimizeButtonPath2.setAttribute("d", "M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z");
minimizeButtonSvg.appendChild(minimizeButtonPath2);

// Create offline message
const offlineMessage = document.createElement("div");
offlineMessage.classList.add("offline-message");
offlineMessage.style.backgroundImage = "linear-gradient(135deg, rgba(42, 39, 218, 0.72) 0%, rgba(0, 204, 255, 0.72) 100%)";
chatHeader.appendChild(offlineMessage);

// const offlineMessageSpan = document.createElement("span");
// offlineMessageSpan.classList.add("online");
// offlineMessage.appendChild(offlineMessageSpan);

// const offlineMessageInnerSpan = document.createElement("span");
// offlineMessageInnerSpan.textContent = "We are online";
// offlineMessageSpan.appendChild(offlineMessageInnerSpan);

const takeScreenshot = document.createElement("button");
takeScreenshot.classList.add("take-screenshot");
takeScreenshot.style.backgroundImage = "linear-gradient(135deg, rgba(42, 39, 218, 0.72) 0%, rgba(0, 204, 255, 0.72) 100%)";
takeScreenshot.textContent = "Take Screenshot";

const image_message = {
    "image": "",
    "message": "",
}

takeScreenshot.addEventListener('click', async () => {
    console.log('clicked ss');
    chatBoardContainer.style.display = 'none';
    const dataUri = await chrome.runtime.sendMessage({ action: 'takeScreenshot' });
    chatBoardContainer.style.display = 'block';
    const { userId } = await new Promise((resolve) => {
        chrome.storage.local.get(['chatbotStatus'], (result) => {
            resolve(result);
        });
    });
    // const response = await chrome.runtime.sendMessage({ action: 'chatMessage', message:dataUri, userId, mimetype: 'image_prompt'});
    image_message.image = dataUri;
    // console.log("Chat response", response);
    createMessage(dataUri, true, 'html');
});



offlineMessage.appendChild(takeScreenshot);


// Create conversation group
const conversationGroup = document.createElement("div");
conversationGroup.id = "conversation-group";
conversationGroup.setAttribute("role", "log");
chat.appendChild(conversationGroup);

// Create messages
const messages = document.createElement("div");
messages.id = "messages";
messages.setAttribute("aria-live", "polite");
messages.setAttribute("aria-atomic", "false");
messages.setAttribute("data-testid", "messagesLog");
conversationGroup.appendChild(messages);

// Create conversation scroll
const conversationScroll = document.createElement("div");
conversationScroll.id = "conversation-scroll";
conversationGroup.appendChild(conversationScroll);

const conversationScrollDiv = document.createElement("div");
conversationScrollDiv.style.top = "0px";
conversationScrollDiv.style.height = "55.8952px";
conversationScroll.appendChild(conversationScrollDiv);

// Create input group
const inputGroup = document.createElement("div");
inputGroup.classList.add("input-group");
chat.appendChild(inputGroup);

const inputGroupHr = document.createElement("hr");
inputGroup.appendChild(inputGroupHr);

const dragActiveWrapper = document.createElement("div");
dragActiveWrapper.classList.add("drag-active-wrapper", "footer-input-wrapper");
inputGroup.appendChild(dragActiveWrapper);

const chatInput = document.createElement("textarea");
chatInput.id = "chat-input";
chatInput.rows = "1";
chatInput.placeholder = "Hit the buttons to respond";
chatInput.setAttribute("aria-label", "New message");
chatInput.setAttribute("data-testid", "newMessageTextarea");
dragActiveWrapper.appendChild(chatInput);

const sentButton = document.createElement("button");
sentButton.id = "SentButton";
sentButton.classList.add("send-icon");
sentButton.title = "SentButton";
sentButton.type = "button";
dragActiveWrapper.appendChild(sentButton);

const sentButtonSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
sentButtonSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
sentButtonSvg.setAttribute("viewBox", "0 0 24 24");
sentButtonSvg.setAttribute("xml:space", "preserve");
sentButton.appendChild(sentButtonSvg);

const sentButtonPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
sentButtonPath.setAttribute("fill", "#d7d7d7");
sentButtonPath.setAttribute("d", "M22,11.7V12h-0.1c-0.1,1-17.7,9.5-18.8,9.1c-1.1-0.4,2.4-6.7,3-7.5C6.8,12.9,17.1,12,17.1,12H17c0,0,0-0.2,0-0.2c0,0,0,0,0,0c0-0.4-10.2-1-10.8-1.7c-0.6-0.7-4-7.1-3-7.5C4.3,2.1,22,10.5,22,11.7z");
sentButtonSvg.appendChild(sentButtonPath);

// Create chat button
const chatButton = document.createElement("div");
chatButton.id = "chat-button";
chatButton.setAttribute("data-testid", "widgetButton");
chatButton.classList.add("chat-closed", "mobile-size__medium");
frameContent.appendChild(chatButton);

const buttonWave = document.createElement("div");
buttonWave.classList.add("buttonWave");
chatButton.appendChild(buttonWave);

const buttonBody = document.createElement("button");
buttonBody.id = "button-body";
buttonBody.setAttribute("data-testid", "widgetButtonBody");
buttonBody.classList.add("chrome");
buttonBody.setAttribute("tabindex", "0");
buttonBody.setAttribute("aria-label", "Open chat widget");
buttonBody.style.background = "linear-gradient(135deg, rgb(42, 39, 218), rgb(0, 204, 255))";
buttonBody.style.boxShadow = "rgba(0, 77, 255, 0.5) 0px 4px 24px";
chatButton.appendChild(buttonBody);

const buttonBodyIcon = document.createElement("i");
buttonBodyIcon.classList.add("material-icons", "type1", "for-closed", "active");
buttonBodyIcon.style.color = "rgb(255, 255, 255)";
buttonBody.appendChild(buttonBodyIcon);

const buttonBodyIconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
buttonBodyIconSvg.setAttribute("id", "ic_bubble");
buttonBodyIconSvg.setAttribute("fill", "#FFFFFF");
buttonBodyIconSvg.setAttribute("height", "24");
buttonBodyIconSvg.setAttribute("viewBox", "0 0 24 24");
buttonBodyIconSvg.setAttribute("width", "24");
buttonBodyIconSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
buttonBodyIcon.appendChild(buttonBodyIconSvg);

const buttonBodyIconPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
buttonBodyIconPath1.setAttribute("d", "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z");
buttonBodyIconSvg.appendChild(buttonBodyIconPath1);

const buttonBodyIconPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
buttonBodyIconPath2.setAttribute("d", "M0 0h24v24H0z");
buttonBodyIconPath2.setAttribute("fill", "none");
buttonBodyIconSvg.appendChild(buttonBodyIconPath2);

// // Get the necessary elements
const chatButton1 = document.getElementById("chat-button");
const chatContainer1 = document.getElementById("chatContainer");
const minimizeButton1 = document.getElementById("minimize-button");
const chatInput1 = document.getElementById("chat-input");
const chatMessages1 = document.getElementById("conversation-group");
const sendButton1 = document.getElementById("SentButton");
const frameContent1 = document.getElementById("frame-content");



// Add event listener to chat button
if (chatButton1) {
    chatButton1.addEventListener("click", function () {
        if (chatContainer1) {
            chatContainer1.classList.add("open");
            chatButton1.classList.add("clicked");
        }
    });
}

// Add event listener to minimize button
if (minimizeButton1) {
    minimizeButton1.addEventListener("click", function () {
        if (chatContainer1) {
            chatContainer1.classList.remove("open");
            chatButton1.classList.remove("clicked");
        }
    });
}

// Function to create a new message
function createMessage(message, isUser = true, type = 'text') {
    const newMessage = document.createElement('div');
    newMessage.classList.add(isUser ? 'sentText' : 'botText');
    if (type === 'html') {
        if (message.startsWith('data:image')) {
            const img = document.createElement('img');
            img.src = message;
            img.width = 200;
            newMessage.appendChild(img);
        } else {
            newMessage.innerHTML = message;
        }
    } else {
        newMessage.textContent = message;
    }
    chatMessages1.appendChild(newMessage);
    return newMessage;
}

// Function to generate chatbot response
function chatbotResponse(response) {
    const messages = ["Hello!", "How can I assist you?", "Let me know if you have any further questions"];
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];
    var botMessage = createMessage(response, false);
    botMessage.scrollIntoView();
}

// Add event listener to chat input for input change
chatInput1.addEventListener("input", function (event) {
    if (event.target.value) {
        sendButton1.classList.add("svgsent");
    } else {
        sendButton1.classList.remove("svgsent");
    }
});

// Add event listener to chat input for keypress (Enter key)
chatInput1.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        const message = chatInput1.value;
        chatInput1.value = "";
        const userMessage = createMessage(message);
        userMessage.scrollIntoView();
        setTimeout(chatbotResponse, 1000);
        sendButton1.classList.add("svgsent");
    }
});

// Add event listener to send button
if (sendButton1) {
    sendButton1.addEventListener("click", async function () {
        const message = chatInput1.value;
        chatInput1.value = "";
        const userMessage = createMessage(message);
        const { userId } = await new Promise((resolve) => {
            chrome.storage.local.get(['chatbotStatus'], (result) => {
                resolve(result);
            });
        });
        let response
        console.log("Chat request json", message, userId);
        if (image_message.image != "") {
            image_message.message = message;
            response = await chrome.runtime.sendMessage({ action: 'chatMessage', message: image_message, userId, mimetype: 'image_prompt' });
            image_message.image = "";
            image_message.message = "";
            console.log("Chat response", response.response);
            userMessage.scrollIntoView();
            chatbotResponse(response.response)
            sendButton1.classList.add("svgsent");
        }
        else {
            response = await chrome.runtime.sendMessage({ action: 'chatMessage', message, userId, mimetype: 'text_prompt' });
            console.log("Chat response", response.response);
            userMessage.scrollIntoView();
            chatbotResponse(response.response)
            sendButton1.classList.add("svgsent");

    }
        // console.log("Chat response", response);
        // userMessage.scrollIntoView();
        // chatbotResponse(response.response)
        // sendButton1.classList.add("svgsent");
    });
}

