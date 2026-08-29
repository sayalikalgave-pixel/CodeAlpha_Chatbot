// ======================================================
// CODEALPHA AI - MAIN JAVASCRIPT
// ======================================================


// ======================================================
// GET HTML ELEMENTS
// ======================================================

const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat-box");

const attachButton = document.getElementById("attach-button");
const fileInput = document.getElementById("file-input");
const filePreview = document.getElementById("file-preview");

const newChatButton = document.getElementById("new-chat");

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");

const chatHistory = document.getElementById("chat-history");


// ======================================================
// SELECTED FILE
// ======================================================

let selectedFile = null;


// ======================================================
// RECENT CHATS STORAGE
// ======================================================

let chats = [];

try {

    chats = JSON.parse(
        localStorage.getItem("codealpha_chats")
    ) || [];

    if (!Array.isArray(chats)) {
        chats = [];
    }

} catch (error) {

    console.error(
        "Could not load recent chats:",
        error
    );

    chats = [];
}


// ======================================================
// INITIALIZE PAGE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    displayRecentChats();

    loadTheme();

});


// ======================================================
// ATTACH FILE BUTTON
// ======================================================

if (attachButton && fileInput) {

    attachButton.addEventListener(
        "click",
        function () {

            fileInput.click();

        }
    );

}


// ======================================================
// FILE SELECTED
// ======================================================

if (fileInput) {

    fileInput.addEventListener(
        "change",
        function () {

            if (!fileInput.files.length) {
                return;
            }

            const file = fileInput.files[0];

            // Only allow images
            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select an image file."
                );

                fileInput.value = "";

                selectedFile = null;

                return;
            }

            selectedFile = file;

            showFilePreview();

        }
    );

}


// ======================================================
// SHOW FILE PREVIEW
// ======================================================

function showFilePreview() {

    if (!filePreview || !selectedFile) {
        return;
    }


    filePreview.innerHTML = "";


    const fileBox =
        document.createElement("div");


    fileBox.className =
        "file-preview-item";


    const icon =
        document.createElement("span");

    icon.textContent = "📎";


    const fileName =
        document.createElement("span");

    fileName.className = "file-name";

    fileName.textContent =
        selectedFile.name;


    const removeButton =
        document.createElement("button");

    removeButton.type = "button";

    removeButton.id = "remove-file";

    removeButton.textContent = "✕";

    removeButton.title = "Remove file";


    removeButton.addEventListener(
        "click",
        removeFile
    );


    fileBox.appendChild(icon);

    fileBox.appendChild(fileName);

    fileBox.appendChild(removeButton);


    filePreview.appendChild(fileBox);

}


// ======================================================
// REMOVE FILE
// ======================================================

function removeFile() {

    selectedFile = null;


    if (fileInput) {
        fileInput.value = "";
    }


    if (filePreview) {
        filePreview.innerHTML = "";
    }

}


// ======================================================
// SEND BUTTON
// ======================================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        sendMessage
    );

}


// ======================================================
// ENTER KEY
// ======================================================

if (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// ======================================================
// DISPLAY RECENT CHATS
// ======================================================

function displayRecentChats() {

    if (!chatHistory) {
        console.error(
            "chat-history element not found."
        );

        return;
    }


    chatHistory.innerHTML = "";


    // No chats
    if (chats.length === 0) {

        const emptyMessage =
            document.createElement("div");

        emptyMessage.className = "no-chats";

        emptyMessage.textContent =
            "No recent chats";

        chatHistory.appendChild(
            emptyMessage
        );

        return;
    }


    // Display chats
    chats.forEach(
        function (chat, index) {

            const chatItem =
                document.createElement("button");


            chatItem.type = "button";

            chatItem.className =
                "chat-history-item";


            chatItem.textContent =
                "💬 " +
                (chat.title || "New Chat");


            chatItem.addEventListener(
                "click",
                function () {

                    openRecentChat(index);

                }
            );


            chatHistory.appendChild(
                chatItem
            );

        }
    );

}


// ======================================================
// SAVE RECENT CHAT
// ======================================================

function saveRecentChat(
    userMessage,
    botReply
) {

    if (!userMessage && !botReply) {
        return;
    }


    const title =
        userMessage
            ? userMessage.substring(0, 35)
            : "Image Chat";


    const chat = {

        title: title,

        userMessage:
            userMessage || "",

        botReply:
            botReply || "No response received."

    };


    chats.unshift(chat);


    // Keep only latest 10 chats

    chats = chats.slice(0, 10);


    try {

        localStorage.setItem(
            "codealpha_chats",
            JSON.stringify(chats)
        );

    } catch (error) {

        console.error(
            "Could not save recent chat:",
            error
        );

    }


    displayRecentChats();

}


// ======================================================
// OPEN RECENT CHAT
// ======================================================

function openRecentChat(index) {

    const chat = chats[index];


    if (!chat) {
        return;
    }


    // Clear chat area

    chatBox.innerHTML = "";


    // User message

    if (chat.userMessage) {

        const userMessage =
            document.createElement("div");

        userMessage.className =
            "user-message";

        userMessage.textContent =
            chat.userMessage;

        chatBox.appendChild(
            userMessage
        );

    }


    // Bot response

    const botMessage =
        document.createElement("div");

    botMessage.className =
        "bot-message";

    botMessage.textContent =
        chat.botReply ||
        "No response available.";


    chatBox.appendChild(
        botMessage
    );


    // Scroll to bottom

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ======================================================
// SEND MESSAGE
// ======================================================

async function sendMessage() {

    if (!input || !sendButton) {
        return;
    }


    const message =
        input.value.trim();


    // Nothing to send

    if (
        message === "" &&
        !selectedFile
    ) {

        return;

    }


    // Hide welcome screen

    const welcome =
        document.getElementById("welcome");


    if (welcome) {
        welcome.style.display = "none";
    }


    // ==============================================
    // SHOW USER MESSAGE
    // ==============================================

    const userMessage =
        document.createElement("div");


    userMessage.className =
        "user-message";


    if (selectedFile) {

        const fileText =
            document.createElement("div");

        fileText.textContent =
            "📎 " + selectedFile.name;


        userMessage.appendChild(
            fileText
        );


        if (message) {

            const messageText =
                document.createElement("div");

            messageText.textContent =
                message;

            userMessage.appendChild(
                messageText
            );

        }

    } else {

        userMessage.textContent =
            message;

    }


    chatBox.appendChild(
        userMessage
    );


    // ==============================================
    // SAVE ORIGINAL MESSAGE
    // ==============================================

    const originalMessage =
        message;


    // ==============================================
    // CLEAR INPUT
    // ==============================================

    input.value = "";


    // ==============================================
    // DISABLE SEND
    // ==============================================

    sendButton.disabled = true;


    // ==============================================
    // THINKING ANIMATION
    // ==============================================

    const thinkingMessage =
        document.createElement("div");


    thinkingMessage.className =
        "bot-message thinking";


    thinkingMessage.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;


    chatBox.appendChild(
        thinkingMessage
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    try {

        // ==========================================
        // FORM DATA
        // ==========================================

        const formData =
            new FormData();


        formData.append(
            "message",
            message
        );


        // Add image

        if (selectedFile) {

            formData.append(
                "file",
                selectedFile
            );

        }


        // ==========================================
        // SEND REQUEST TO FLASK
        // ==========================================

        const response =
            await fetch(
                "/chat",
                {
                    method: "POST",
                    body: formData
                }
            );


        // ==========================================
        // READ RESPONSE
        // ==========================================

        let data;


        try {

            data = await response.json();

        } catch (error) {

            throw new Error(
                "Server returned an invalid response."
            );

        }


        // ==========================================
        // REMOVE THINKING
        // ==========================================

        thinkingMessage.remove();


        // ==========================================
        // BOT RESPONSE
        // ==========================================

        const botReply =
            data.reply ||
            "No response received.";


        const botMessage =
            document.createElement("div");


        botMessage.className =
            "bot-message";


        botMessage.textContent =
            botReply;


        chatBox.appendChild(
            botMessage
        );


        // ==========================================
        // SAVE CHAT
        // ==========================================

        saveRecentChat(
            originalMessage,
            botReply
        );


        // ==========================================
        // SHOW SERVER ERROR
        // ==========================================

        if (!response.ok) {

            console.error(
                "Server error:",
                data.error
            );

        }

    } catch (error) {

        console.error(
            "CHAT ERROR:",
            error
        );


        // Remove thinking animation

        if (
            thinkingMessage &&
            thinkingMessage.parentNode
        ) {

            thinkingMessage.remove();

        }


        // Show error

        const errorMessage =
            document.createElement("div");


        errorMessage.className =
            "bot-message";


        errorMessage.textContent =
            "Sorry, something went wrong. " +
            "Please check the Flask terminal.";


        chatBox.appendChild(
            errorMessage
        );


        // Save failed chat too

        saveRecentChat(
            originalMessage,
            "Sorry, something went wrong."
        );

    }


    // ==============================================
    // REMOVE SELECTED FILE
    // ==============================================

    removeFile();


    // ==============================================
    // ENABLE SEND
    // ==============================================

    sendButton.disabled = false;


    input.focus();


    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// ======================================================
// SUGGESTIONS
// ======================================================

function useSuggestion(text) {

    if (!input) {
        return;
    }


    input.value = text;

    input.focus();


    sendMessage();

}


// ======================================================
// NEW CHAT
// ======================================================

if (newChatButton) {

    newChatButton.addEventListener(
        "click",
        function () {

            chatBox.innerHTML = `
                <div id="welcome" class="welcome">

                    <div class="welcome-icon">
                        🤖
                    </div>

                    <h1>
                        How can I help you?
                    </h1>

                    <p>
                        Ask me anything — coding,
                        studying, writing, ideas
                        and more.
                    </p>

                    <div class="suggestions">

                        <button
                            type="button"
                            class="suggestion-button"
                            data-suggestion="Explain machine learning in simple words"
                        >
                            🧠 Explain Machine Learning
                        </button>

                        <button
                            type="button"
                            class="suggestion-button"
                            data-suggestion="Write a Python program to reverse a string"
                        >
                            💻 Help me with Python
                        </button>

                        <button
                            type="button"
                            class="suggestion-button"
                            data-suggestion="Give me some project ideas for MCA students"
                        >
                            💡 Give me project ideas
                        </button>

                    </div>

                </div>
            `;


            // Reconnect suggestion buttons

            const suggestionButtons =
                document.querySelectorAll(
                    ".suggestion-button"
                );


            suggestionButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            useSuggestion(
                                button.dataset.suggestion
                            );

                        }
                    );

                }
            );


            input.value = "";


            removeFile();


            input.focus();

        }
    );

}


// ======================================================
// DARK / LIGHT MODE
// ======================================================

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            if (isDark) {

                localStorage.setItem(
                    "theme",
                    "dark"
                );

                updateThemeButton(true);

            } else {

                localStorage.setItem(
                    "theme",
                    "light"
                );

                updateThemeButton(false);

            }

        }
    );

}


// ======================================================
// UPDATE THEME BUTTON
// ======================================================

function updateThemeButton(isDark) {

    if (themeIcon) {

        themeIcon.textContent =
            isDark
                ? "☀️"
                : "🌙";

    }


    if (themeText) {

        themeText.textContent =
            isDark
                ? "Light Mode"
                : "Dark Mode";

    }

}


// ======================================================
// LOAD SAVED THEME
// ======================================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        updateThemeButton(true);

    } else {

        document.body.classList.remove(
            "dark"
        );

        updateThemeButton(false);

    }

}


// ======================================================
// DEBUG INFORMATION
// ======================================================

console.log(
    "CodeAlpha AI JavaScript loaded successfully."
);

console.log(
    "Recent chats:",
    chats
);

